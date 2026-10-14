import type { RequestHandler } from "express";
import {
  createCanvasElement,
  getCanvasElement,
  getCanvasForBooking,
  saveCanvasElement,
} from "./canvas.repository.js";
import { GetCanvasQuerySchema, PostCanvasBodySchema } from "./models/canvas.js";
import { sendValidationError } from "../../shared/error-response.js";

export const getCanvasController: RequestHandler = async (
  request,
  response,
) => {
  const query = GetCanvasQuerySchema.safeParse(request.query);
  if (!query.success) {
    sendValidationError(response, "A bookingId is required", query.error);
    return;
  }

  const { bookingId } = query.data;
  const canvas = await getCanvasForBooking(bookingId);
  response.status(200).json({ bookingId, canvas });
};

export const postCanvasController: RequestHandler = async (
  request,
  response,
) => {
  const body = PostCanvasBodySchema.safeParse(request.body);
  if (!body.success) {
    sendValidationError(response, "Invalid request body", body.error);
    return;
  }

  const { bookingId, element } = body.data;
  const existingElement = await getCanvasElement(bookingId, element.id);
  const savedElement =
    existingElement === null
      ? await createCanvasElement(bookingId, element)
      : await saveCanvasElement(bookingId, { ...existingElement, ...element });

  response.status(200).json({ success: true, element: savedElement });
};
