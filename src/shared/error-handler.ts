import type { ErrorRequestHandler } from "express";
import { sendErrorResponse } from "./error-response.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  next,
) => {
  console.error("Unhandled request error", {
    method: request.method,
    path: request.originalUrl,
    error,
  });

  if (response.headersSent) {
    next(error);
    return;
  }

  sendErrorResponse(response, 500, "Internal server error.");
};
