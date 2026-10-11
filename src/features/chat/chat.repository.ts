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

export async function createChatMessage(
  bookingId: string,
  sender: string,
  text: string,
): Promise<ChatMessage> {
  const timestamp = new Date().toISOString();
  const [insertedId] = await database<ChatMessageRecord>(
    "chat_messages",
  ).insert({
    booking_id: bookingId,
    sender,
    text,
    created_at: timestamp,
  });

  return {
    id: BigInt(insertedId).toString(36),
    sender,
    text,
    timestamp,
  };
}
