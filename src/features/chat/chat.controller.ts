import type { RequestHandler } from "express";
import type { AppConfig } from "../../config.js";
import { ManagementHttpClient } from "../access/management-http-client.js";
import { createChatMessage, getChatHistory } from "./chat.repository.js";
import { GetChatQuerySchema, PostChatMessageSchema } from "./models/chat.js";
import {
  sendErrorResponse,
  sendValidationError,
} from "../../shared/error-response.js";

export function getChatController(config: AppConfig): RequestHandler {
  const managementHttpClient = new ManagementHttpClient(
    config.managementApiUrl,
  );

  return async (request, response) => {
    const query = GetChatQuerySchema.safeParse(request.query);
    if (!query.success) {
      sendValidationError(response, "A bookingId is required", query.error);
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
      sendValidationError(
        response,
        "Invalid request body",
        messageRequest.error,
      );
      return;
    }

    const { bookingId, text } = messageRequest.data;
    const booking =
      await managementHttpClient.getBookingByIdIfExists(bookingId);
    if (booking === null) {
      sendErrorResponse(response, 404, "Booking not found");
      return;
    }

    const activeBookingId =
      await managementHttpClient.getActiveBookingIdForRoom(booking.roomId);
    if (activeBookingId !== bookingId) {
      sendErrorResponse(response, 400, "No active booking found for this room");
      return;
    }

    const sender = response.locals.userId as string;
    const message = await createChatMessage(bookingId, sender, text);

    response.status(200).json({ success: true, message });
  };
}
