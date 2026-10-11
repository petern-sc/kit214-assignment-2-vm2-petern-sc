import { Router } from "express";
import type { AppConfig } from "../../config.js";
import { createRequireAuth } from "../../shared/require-auth.js";
import { getCanvasController } from "./canvas.controller.js";

export function createCanvasRoutes(config: AppConfig) {
  const canvasRouter = Router();

  canvasRouter.get("/canvas", createRequireAuth(config), getCanvasController);

  return canvasRouter;
}
