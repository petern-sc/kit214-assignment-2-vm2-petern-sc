import { database } from "../../shared/database.js";
import type { ChatMessage, ChatMessageRecord } from "./models/chat.js";

export async function getChatHistory(
  bookingId: string,
): Promise<ChatMessage[]> {
  const records = await database<ChatMessageRecord>("chat_messages")
    .select<ChatMessageRecord[]>(
      database.raw("CAST(id AS CHAR) AS id"),
      "sender",
      "text",
      "created_at",
    )
    .where({ booking_id: bookingId })
    .orderBy("chat_messages.id", "asc");

  return records.map((record) => ({
    id: BigInt(record.id).toString(36),
    sender: record.sender,
    text: record.text,
    timestamp: record.created_at,
  }));
}
