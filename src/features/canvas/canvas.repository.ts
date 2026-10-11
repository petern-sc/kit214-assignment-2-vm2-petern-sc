import { database } from "../../shared/database.js";
import type { CanvasElement } from "./models/canvas.js";

type CanvasElementRecord = {
  booking_id: string;
  id: string;
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
): Promise<CanvasElement[]> {
  const records = await database<CanvasElementRecord>("canvas_elements")
    .select<CanvasElementRecord[]>("*")
    .where("booking_id", bookingId);

  return records.map(canvasElementFromRecord);
}

export async function getCanvasElement(
  bookingId: string,
  elementId: string,
): Promise<CanvasElement | null> {
  const record = await database<CanvasElementRecord>("canvas_elements")
    .where({ booking_id: bookingId, id: elementId })
    .first();

  if (record === undefined) {
    return null;
  }

  return canvasElementFromRecord(record);
}

export async function createCanvasElement(
  bookingId: string,
  element: CanvasElement,
): Promise<CanvasElement> {
  await database("canvas_elements").insert(
    toCanvasElementRecord(bookingId, element),
  );

  return element;
}

export async function saveCanvasElement(
  bookingId: string,
  element: CanvasElement,
): Promise<CanvasElement> {
  await database<CanvasElementRecord>("canvas_elements")
    .where({ booking_id: bookingId, id: element.id })
    .update(toCanvasElementRecord(bookingId, element));

  return element;
}

function canvasElementFromRecord(record: CanvasElementRecord): CanvasElement {
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

function toCanvasElementRecord(
  bookingId: string,
  element: CanvasElement,
): CanvasElementRecord {
  return {
    booking_id: bookingId,
    id: element.id,
    element_type: jsonColumn(element.type),
    shape_type: element.shapeType ?? null,
    x: element.x ?? null,
    y: element.y ?? null,
    color: jsonColumn(element.color),
    content: element.content ?? null,
    text: element.text ?? null,
    width: element.width ?? null,
    height: element.height ?? null,
  };
}

function jsonColumn(value: string | number | undefined): string | null {
  return value === undefined ? null : JSON.stringify(value);
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
