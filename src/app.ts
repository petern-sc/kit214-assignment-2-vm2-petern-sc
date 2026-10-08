import express from "express";
import type { AppConfig } from "./config.js";
import { createAccessRoutes } from "./features/access/access.routes.js";
import { errorHandler } from "./shared/error-handler.js";

export function createApp(config: AppConfig) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(createAccessRoutes(config));

  app.get("/", (_request, response) => {
    response.json({ message: "Hello, world!" });
  });

  app.use(errorHandler);

  return app;
}
