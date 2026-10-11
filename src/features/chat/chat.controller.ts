import type { RequestHandler } from "express";
import type { AppConfig } from "../../config.js";
import { ManagementHttpClient } from "../access/management-http-client.js";
import { getChatHistory } from "./chat.repository.js";
import { GetChatQuerySchema } from "./models/chat.js";

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
      response.status(404).json({ error: "Booking not found" });
      return;
    }

    const chat = await getChatHistory(bookingId);
    response.status(200).json({ bookingId, chat });
  };
}
