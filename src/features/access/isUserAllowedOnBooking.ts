import type { ManagementBooking } from "./models/access.js";

export function isUserAllowedOnBooking(
  booking: ManagementBooking,
  userId: string,
): boolean {
  return booking.userId === userId || booking.invitedUserIds.includes(userId);
}
