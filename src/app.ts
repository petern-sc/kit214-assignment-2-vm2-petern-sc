import express from "express";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get("/", (_request, response) => {
    response.json({ message: "Hello, world!" });
  });

  return app;
}
