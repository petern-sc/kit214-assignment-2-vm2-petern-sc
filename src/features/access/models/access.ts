import { z } from "zod";

export const AccessRequestSchema = z.object({
  bookingId: z.string().min(1),
  roomId: z.string().min(1),
});

export type AccessRequest = z.infer<typeof AccessRequestSchema>;

export const ActiveBookingResponseSchema = z.object({
  bookingId: z.string().nullable(),
});

export const ManagementBookingSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  userId: z.string(),
  invitedUserIds: z.array(z.string()),
});

export type ManagementBooking = z.infer<typeof ManagementBookingSchema>;

export type AccessResponse = {
  success: true;
  message: string;
  userId?: string;
};
