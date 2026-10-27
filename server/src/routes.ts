import { Router, type Request, type Response } from "express";
import { ZodError } from "zod";
import { config } from "./config.js";
import { chatRequestSchema } from "./schemas.js";
import { generateAgricultureAdvice } from "./gemini.js";
import {
  checkSupabaseConnection,
  persistChatInteraction,
  getSessionMessages,
  deleteSessionHistory,
} from "./supabase.js";
import { AppError, createErrorResponse, createSuccessResponse } from "./errors.js";

const router = Router();

// GET /api/health
router.get("/health", async (_req: Request, res: Response) => {
  const supabaseHealth = await checkSupabaseConnection();
  res.json({
    status: "ok",
    service: "krishimitra-api",
    supabase: supabaseHealth.status,
    ...(supabaseHealth.details ? { supabaseDetails: supabaseHealth.details } : {}),
  });
});

// GET /api/config
router.get("/config", (_req: Request, res: Response) => {
  res.json({
    appName: config.appName,
    supportedLanguages: config.supportedLanguages,
    maxMessageLength: config.maxMessageLength,
    maxHistoryMessages: config.maxHistoryMessages,
    persistenceEnabled: config.persistenceEnabled,
    supabaseConfigured: config.isSupabaseConfigured,
  });
});

// POST /api/chat
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const parsed = chatRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      res.status(400).json(
        createErrorResponse(
          "VALIDATION_ERROR",
          firstIssue?.message || "Invalid request data."
        )
      );
      return;
    }

    const { message, language, context, history, sessionId, userId } = parsed.data;

    const result = await generateAgricultureAdvice(
      message,
      language,
      context,
      history
    );

    // Persist to Supabase if persistence is enabled (background safe)
    if (config.persistenceEnabled) {
      const activeSessionId = sessionId || `session_${Date.now()}`;
      persistChatInteraction({
        sessionId: activeSessionId,
        userId,
        userMessage: message,
        language,
        context: context as Record<string, unknown> | undefined,
        advisoryResponse: result as unknown as Record<string, unknown>,
      }).catch((err) => {
        console.warn("Failed to persist chat interaction:", err);
      });
    }

    res.json(createSuccessResponse(result));
  } catch (error: unknown) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json(
        createErrorResponse(error.code, error.message)
      );
      return;
    }

    if (error instanceof ZodError) {
      res.status(400).json(
        createErrorResponse(
          "VALIDATION_ERROR",
          error.issues[0]?.message || "Invalid request data."
        )
      );
      return;
    }

    console.error("Unexpected error:", error);
    res.status(500).json(
      createErrorResponse(
        "INTERNAL_ERROR",
        "An unexpected error occurred. Please try again."
      )
    );
  }
});

// GET /api/chat/history/:sessionId
router.get("/chat/history/:sessionId", async (req: Request, res: Response) => {
  const sessionId = Array.isArray(req.params.sessionId)
    ? req.params.sessionId[0]
    : req.params.sessionId;

  if (!sessionId || typeof sessionId !== "string") {
    res.status(400).json(
      createErrorResponse("VALIDATION_ERROR", "Session ID is required.")
    );
    return;
  }

  const messages = await getSessionMessages(sessionId);
  res.json(createSuccessResponse({ messages }));
});

// DELETE /api/chat/session
router.delete("/chat/session", async (req: Request, res: Response) => {
  const rawSessionId = req.body?.sessionId || req.query.sessionId;
  const sessionId = typeof rawSessionId === "string" ? rawSessionId : undefined;
  if (sessionId) {
    await deleteSessionHistory(sessionId);
  }
  res.json(createSuccessResponse({ cleared: true }));
});

export default router;
