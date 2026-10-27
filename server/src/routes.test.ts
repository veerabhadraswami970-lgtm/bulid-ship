import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./index.js";

describe("GET /api/health", () => {
  it("returns ok status and safe supabase status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("krishimitra-api");
    expect(res.body).toHaveProperty("supabase");
  });
});

describe("GET /api/config", () => {
  it("returns application config", async () => {
    const res = await request(app).get("/api/config");
    expect(res.status).toBe(200);
    expect(res.body.appName).toBe("KrishiMitra AI");
    expect(res.body.supportedLanguages).toEqual(["en", "hi", "te"]);
    expect(res.body.maxMessageLength).toBe(2000);
    expect(res.body).toHaveProperty("persistenceEnabled");
    expect(res.body).toHaveProperty("supabaseConfigured");
  });

  it("does not expose API keys or secrets", async () => {
    const res = await request(app).get("/api/config");
    const body = JSON.stringify(res.body);
    expect(body).not.toContain("GEMINI_API_KEY");
    expect(body).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(body).not.toContain("SUPABASE_ANON_KEY");
    expect(body).not.toContain("serviceRole");
    expect(body).not.toContain("apiKey");
  });
});

describe("POST /api/chat - Validation", () => {
  it("rejects empty message", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({ message: "", language: "en" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects missing message", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({ language: "en" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects whitespace-only message", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({ message: "   ", language: "en" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects overly long message", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({ message: "a".repeat(2001), language: "en" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects invalid language", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({ message: "What crop to grow?", language: "fr" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("accepts valid language 'en'", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({ message: "What crop to grow?", language: "en" });
    expect(res.status).not.toBe(400);
  });

  it("accepts valid language 'hi'", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({ message: "कौन सी फसल उगाएं?", language: "hi" });
    expect(res.status).not.toBe(400);
  });

  it("accepts valid language 'te'", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({ message: "ఏ పంట వేయాలి?", language: "te" });
    expect(res.status).not.toBe(400);
  });

  it("accepts valid farming context and sessionId", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({
        message: "When should I harvest?",
        language: "en",
        sessionId: "test-session-123",
        context: {
          cropName: "Wheat",
          state: "Punjab",
          soilType: "Alluvial",
          growthStage: "fruiting",
          waterAvailability: "medium",
        },
      });
    expect(res.status).not.toBe(400);
  });

  it("accepts valid conversation history", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({
        message: "How much fertilizer?",
        language: "en",
        history: [
          { role: "user", content: "I am growing rice." },
          { role: "assistant", content: "Rice requires good water management." },
        ],
      });
    expect(res.status).not.toBe(400);
  });

  it("rejects invalid history role", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({
        message: "How much fertilizer?",
        language: "en",
        history: [{ role: "moderator", content: "Hello" }],
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("DELETE /api/chat/session", () => {
  it("clears chat session", async () => {
    const res = await request(app).delete("/api/chat/session");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.cleared).toBe(true);
  });
});

describe("GET /api/chat/history/:sessionId", () => {
  it("handles history request for a session ID", async () => {
    const res = await request(app).get("/api/chat/history/session_test_456");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.messages)).toBe(true);
  });
});

describe("Security Headers", () => {
  it("includes security headers from helmet", async () => {
    const res = await request(app).get("/api/health");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
  });
});

describe("404 Handler", () => {
  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/api/unknown-endpoint");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});
