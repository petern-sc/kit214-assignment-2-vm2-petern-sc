import { Router } from "express";
import type { AppConfig } from "../../config.js";
import { createRequireAuth } from "../../shared/require-auth.js";
import { getChatController, postChatController } from "./chat.controller.js";

export function createChatRoutes(config: AppConfig) {
  const chatRouter = Router();

  chatRouter.get("/chat", createRequireAuth(config), getChatController(config));
  chatRouter.post(
    "/chat",
    createRequireAuth(config),
    postChatController(config),
  );

  return chatRouter;
}
