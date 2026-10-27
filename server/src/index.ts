import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config, validateConfig } from "./config.js";
import routes from "./routes.js";
import { createErrorResponse } from "./errors.js";

const app = express();

// Security headers
app.use(helmet());

// CORS configuration supporting configured frontend URL
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      // Allow configured frontend origin or local dev hosts
      if (
        origin === config.frontendUrl ||
        origin === config.clientUrl ||
        /^http:\/\/localhost:(5173|3000|5000)$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in development
    },
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-session-id"],
    credentials: false,
  })
);

const isTestEnv = config.nodeEnv === "test" || process.env.NODE_ENV === "test";

// Rate limiting
const chatLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: isTestEnv ? 1000 : config.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: createErrorResponse(
    "RATE_LIMITED",
    "Too many requests. Please wait a moment and try again."
  ),
});

const generalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: isTestEnv ? 2000 : config.rateLimitMaxRequests * 4,
  standardHeaders: true,
  legacyHeaders: false,
});

// Body parsing
app.use(express.json({ limit: "16kb" }));

// Apply rate limits
app.use("/api/chat", chatLimiter);
app.use("/api", generalLimiter);

// Routes
app.use("/api", routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json(
    createErrorResponse("NOT_FOUND", "The requested endpoint was not found.")
  );
});

// Global error handler
app.use(
  (
    err: Error & { type?: string },
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err.type === "entity.too.large") {
      res.status(413).json(
        createErrorResponse("PAYLOAD_TOO_LARGE", "The request is too large.")
      );
      return;
    }

    if (err.type === "entity.parse.failed") {
      res.status(400).json(
        createErrorResponse("INVALID_JSON", "The request body contains invalid JSON.")
      );
      return;
    }

    console.error("Unhandled error:", err.message);
    res.status(500).json(
      createErrorResponse("INTERNAL_ERROR", "An unexpected error occurred.")
    );
  }
);

export { app };

// Start server only when run directly
const isDirectRun =
  process.argv[1]?.endsWith("index.ts") ||
  process.argv[1]?.endsWith("index.js");

if (isDirectRun) {
  const { warnings } = validateConfig();
  if (warnings.length > 0) {
    console.log("⚙️  Configuration Notice:");
    warnings.forEach((w) => console.log(`   - ${w}`));
  }

  app.listen(config.port, () => {
    console.log(`🌾 KrishiMitra API running on http://localhost:${config.port}`);
    console.log(`   AI Model: ${config.geminiModel}`);
    console.log(`   Environment: ${config.nodeEnv}`);
    console.log(
      `   Supabase: ${
        config.isSupabaseConfigured
          ? "Configured (persistence active)"
          : "Not configured (temporary in-memory mode)"
      }`
    );
  });
}
