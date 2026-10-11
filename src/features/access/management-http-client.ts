import { HttpClient } from "../../shared/http-client.js";
import {
  ActiveBookingResponseSchema,
  type ManagementBooking,
  ManagementBookingSchema,
} from "./models/access.js";

export class ManagementHttpClient {
  private readonly httpClient: HttpClient;

  constructor(baseUrl: string) {
    this.httpClient = new HttpClient(baseUrl);
  }

  async getActiveBookingIdForRoom(roomId: string): Promise<string | null> {
    const response = await this.httpClient.query("/bookings/status", {
      roomId,
    });

    const result = ActiveBookingResponseSchema.safeParse(response);
    if (!result.success) {
      throw new Error("Management API returned an invalid booking status");
    }

    return result.data.bookingId;
  }

  async getBookingById(bookingId: string): Promise<ManagementBooking> {
    const booking = await this.getBookingByIdIfExists(bookingId);
    if (booking === null) {
      throw new Error("Management API could not find the booking");
    }

    return booking;
  }

  async getBookingByIdIfExists(
    bookingId: string,
  ): Promise<ManagementBooking | null> {
    const response = await this.httpClient.getOptional(
      `/bookings/${encodeURIComponent(bookingId)}`,
    );
    if (response === null) {
      return null;
    }

    const result = ManagementBookingSchema.safeParse(response);
    if (!result.success) {
      throw new Error("Management API returned an invalid booking");
    }

    return result.data;
  }
}
