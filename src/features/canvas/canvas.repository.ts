import { database } from "../../shared/database.js";
import type { CanvasEntry } from "./models/canvas.js";

type CanvasElementRecord = {
  booking_id: string;
  position: number;
  id: string | null;
  element_type: string | number | null;
  shape_type: string | null;
  x: number | null;
  y: number | null;
  color: string | number | null;
  content: string | null;
  text: string | null;
  width: number | null;
  height: number | null;
};

export async function getCanvasForBooking(
  bookingId: string,
): Promise<CanvasEntry[]> {
  const records = await database<CanvasElementRecord>("canvas_elements")
    .select<CanvasElementRecord[]>("*")
    .where("booking_id", bookingId)
    .orderBy("position", "asc");

  return records.map(canvasEntryFromRecord);
}

function canvasEntryFromRecord(record: CanvasElementRecord): CanvasEntry {
  if (record.id === null) {
    return null;
  }

  return {
    id: record.id,
    ...optionalField("type", record.element_type),
    ...optionalField("shapeType", record.shape_type),
    ...optionalField("x", record.x),
    ...optionalField("y", record.y),
    ...optionalField("color", record.color),
    ...optionalField("content", record.content),
    ...optionalField("text", record.text),
    ...optionalField("width", record.width),
    ...optionalField("height", record.height),
  };
}

function optionalField<Key extends string, Value>(
  key: Key,
  value: Value | null,
): Partial<Record<Key, Value>> {
  if (value === null) {
    return {};
  }

  return { [key]: value } as Record<Key, Value>;
}
