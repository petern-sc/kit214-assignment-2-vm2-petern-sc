import type { RequestHandler } from "express";
import type { AppConfig } from "../../config.js";
import { ManagementHttpClient } from "./management-http-client.js";
import { isUserAllowedOnBooking } from "./isUserAllowedOnBooking.js";
import { AccessRequestSchema, type AccessResponse } from "./models/access.js";
import {
  sendErrorResponse,
  sendValidationError,
} from "../../shared/error-response.js";

export function createRoomSessionController(config: AppConfig): RequestHandler {
  const managementHttpClient = new ManagementHttpClient(
    config.managementApiUrl,
  );

  return async (request, response) => {
    const accessRequest = AccessRequestSchema.safeParse(request.body);
    if (!accessRequest.success) {
      sendValidationError(
        response,
        "Invalid access request",
        accessRequest.error,
      );
      return;
    }

    const { bookingId, roomId } = accessRequest.data;
    const activeBookingId =
      await managementHttpClient.getActiveBookingIdForRoom(roomId);
    if (activeBookingId === null || activeBookingId !== bookingId) {
      sendErrorResponse(response, 400, "No active booking found for this room");
      return;
    }

    const booking = await managementHttpClient.getBookingById(activeBookingId);
    if (booking.id !== bookingId || booking.roomId !== roomId) {
      sendErrorResponse(response, 400, "Booking does not match this room");
      return;
    }

    const userId = response.locals.userId as string;
    if (!isUserAllowedOnBooking(booking, userId)) {
      sendErrorResponse(
        response,
        400,
        "User is not allowed to access this booking",
      );
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
