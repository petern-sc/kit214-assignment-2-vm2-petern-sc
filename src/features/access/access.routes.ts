import { Router } from "express";
import type { AppConfig } from "../../config.js";
import { createRequireAuth } from "../../shared/require-auth.js";
import { createRoomSessionController } from "./access.controller.js";

export function createAccessRoutes(config: AppConfig) {
  const accessRouter = Router();

  accessRouter.post(
    "/access",
    createRequireAuth(config),
    createRoomSessionController(config),
  );

  return accessRouter;
}
