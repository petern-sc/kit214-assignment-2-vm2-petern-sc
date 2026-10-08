import type { RequestHandler } from "express";
import type { AppConfig } from "../../config.js";
import { ManagementHttpClient } from "./management-http-client.js";
import { AccessRequestSchema, type AccessResponse } from "./models/access.js";

export function createRoomSessionController(config: AppConfig): RequestHandler {
  const managementHttpClient = new ManagementHttpClient(
    config.managementApiUrl,
  );

  return async (request, response) => {
    const accessRequest = AccessRequestSchema.safeParse(request.body);
    if (!accessRequest.success) {
      response.status(400).json({ error: "Invalid access request" });
      return;
    }

    const { bookingId, roomId } = accessRequest.data;
    const activeBookingId =
      await managementHttpClient.getActiveBookingIdForRoom(roomId);
    if (activeBookingId === null || activeBookingId !== bookingId) {
      response
        .status(400)
        .json({ error: "No active booking found for this room" });
      return;
    }

    const booking = await managementHttpClient.getBookingById(activeBookingId);
    if (booking.id !== bookingId || booking.roomId !== roomId) {
      response.status(400).json({ error: "Booking does not match this room" });
      return;
    }

    const userId = response.locals.userId as string;
    const allowedUserIds = new Set([booking.userId, ...booking.invitedUserIds]);
    if (!allowedUserIds.has(userId)) {
      response
        .status(400)
        .json({ error: "User is not allowed to access this booking" });
      return;
    }

    const accessResponse: AccessResponse = {
      success: true,
      message: "Access granted",
      userId,
    };

    response.status(200).json(accessResponse);
  };
}
