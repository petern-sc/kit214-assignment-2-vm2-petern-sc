import type { ErrorRequestHandler } from "express";
import { sendErrorResponse } from "./error-response.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  next,
) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (
    error instanceof SyntaxError &&
    "type" in error &&
    error.type === "entity.parse.failed" &&
    "status" in error &&
    error.status === 400
  ) {
    sendErrorResponse(response, 400, "Malformed JSON request body");
    return;
  }

  console.error("Unhandled request error", {
    method: request.method,
    path: request.originalUrl,
    error,
  });

  sendErrorResponse(response, 500, "Internal server error.");
};
