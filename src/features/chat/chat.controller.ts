import type { RequestHandler } from "express";
import type { AppConfig } from "../../config.js";
import { ManagementHttpClient } from "../access/management-http-client.js";
import { createChatMessage, getChatHistory } from "./chat.repository.js";
import { GetChatQuerySchema, PostChatMessageSchema } from "./models/chat.js";

export function getChatController(config: AppConfig): RequestHandler {
  const managementHttpClient = new ManagementHttpClient(
    config.managementApiUrl,
  );

  return async (request, response) => {
    const query = GetChatQuerySchema.safeParse(request.query);
    if (!query.success) {
      response.status(400).json({ error: "A bookingId is required" });
      return;
    }

    const { bookingId } = query.data;
    const booking =
      await managementHttpClient.getBookingByIdIfExists(bookingId);
    if (booking === null) {
      response.status(200).json({ bookingId, chat: [] });
      return;
    }

    const chat = await getChatHistory(bookingId);
    response.status(200).json({ bookingId, chat });
  };
}

export function postChatController(config: AppConfig): RequestHandler {
  const managementHttpClient = new ManagementHttpClient(
    config.managementApiUrl,
  );

  return async (request, response) => {
    const messageRequest = PostChatMessageSchema.safeParse(request.body);
    if (!messageRequest.success) {
      response.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { bookingId, text } = messageRequest.data;
    const booking =
      await managementHttpClient.getBookingByIdIfExists(bookingId);
    if (booking === null) {
      response.status(404).json({ error: "Booking not found" });
      return;
    }

    const activeBookingId =
      await managementHttpClient.getActiveBookingIdForRoom(booking.roomId);
    if (activeBookingId !== bookingId) {
      response
        .status(400)
        .json({ error: "No active booking found for this room" });
      return;
    }

    const sender = response.locals.userId as string;
    const message = await createChatMessage(bookingId, sender, text);

    response.status(200).json({ success: true, message });
  };
}
