import { z } from "zod";

export const GetChatQuerySchema = z.object({
  bookingId: z.string().min(1),
});

export type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
};

export type ChatMessageRecord = {
  id: string;
  booking_id: string;
  sender: string;
  text: string;
  created_at: string;
};
