import express from "express";
import type { AppConfig } from "./config.js";
import { createAccessRoutes } from "./features/access/access.routes.js";
import { createCanvasRoutes } from "./features/canvas/canvas.routes.js";
import { createChatRoutes } from "./features/chat/chat.routes.js";
import { corsMiddleware } from "./shared/cors.js";
import { errorHandler } from "./shared/error-handler.js";

export function createApp(config: AppConfig) {
  const app = express();

  app.use(corsMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(createAccessRoutes(config));
  app.use(createCanvasRoutes(config));
  app.use(createChatRoutes(config));

  app.get("/ping", (_request, response) => {
    response.status(200).json({ status: "pong" });
  });

  app.get("/", (_request, response) => {
    response.json({ message: "Hello, world!" });
  });

  app.use(errorHandler);

  return app;
}
