import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Chatbot endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationHistory = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // System prompt for Luna - the menstrual health assistant
      const systemPrompt = `You are Luna, a caring and knowledgeable menstrual health assistant for the HerHealth app. 
Your role is to provide helpful, accurate, and empathetic information about:
- Menstrual cycles and phases
- PMS and PMDD symptoms
- Period pain management
- Ovulation and fertility tracking
- Hormonal changes and their effects
- General menstrual wellness and self-care

Guidelines:
- Be warm, supportive, and non-judgmental
- Provide evidence-based information
- Suggest lifestyle changes, natural remedies, and when to consult a healthcare provider
- Never diagnose medical conditions
- Always recommend seeing a doctor for severe or concerning symptoms
- Keep responses concise and practical (2-4 sentences typically)
- Use encouraging language

Remember: You're a helpful assistant, not a replacement for medical professionals.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "user", content: message },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 300,
      });

      const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that. Could you rephrase your question?";

      res.json({ response });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        error: "Failed to get response",
        message: error.message 
      });
    }
  });

  // Daily log endpoint (mood, symptoms, flow, notes)
  app.post("/api/daily-log", async (req, res) => {
    try {
      const { userId, date, mood, symptoms, flowIntensity, note } = req.body;

      if (!userId || !date) {
        return res.status(400).json({ error: "userId and date are required" });
      }

      res.json({ 
        success: true,
        message: "Daily log saved successfully" 
      });
    } catch (error: any) {
      console.error("Daily log error:", error);
      res.status(500).json({ 
        error: "Failed to save daily log",
        message: error.message 
      });
    }
  });

  // Get daily logs endpoint
  app.get("/api/daily-logs/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      res.json({ logs: [] });
    } catch (error: any) {
      console.error("Get daily logs error:", error);
      res.status(500).json({ 
        error: "Failed to get daily logs",
        message: error.message 
      });
    }
  });

  // Period logging endpoint
  app.post("/api/period", async (req, res) => {
    try {
      const { userId, startDate, endDate, flowIntensity } = req.body;

      if (!userId || !startDate) {
        return res.status(400).json({ error: "userId and startDate are required" });
      }

      res.json({ 
        success: true,
        message: "Period logged successfully" 
      });
    } catch (error: any) {
      console.error("Period log error:", error);
      res.status(500).json({ 
        error: "Failed to log period",
        message: error.message 
      });
    }
  });

  // Get periods endpoint
  app.get("/api/periods/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      res.json({ periods: [] });
    } catch (error: any) {
      console.error("Get periods error:", error);
      res.status(500).json({ 
        error: "Failed to get periods",
        message: error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
