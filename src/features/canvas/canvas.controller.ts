import type { RequestHandler } from "express";
import { getCanvasForBooking } from "./canvas.repository.js";
import { GetCanvasQuerySchema } from "./models/canvas.js";

export const getCanvasController: RequestHandler = async (
  request,
  response,
) => {
  const query = GetCanvasQuerySchema.safeParse(request.query);
  if (!query.success) {
    response.status(400).json({ error: "A bookingId is required" });
    return;
  }

  const { bookingId } = query.data;
  const canvas = await getCanvasForBooking(bookingId);
  response.status(200).json({ bookingId, canvas });
};
