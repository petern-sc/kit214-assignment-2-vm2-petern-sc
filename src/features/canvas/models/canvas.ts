import { z } from "zod";

export const GetCanvasQuerySchema = z.object({
  bookingId: z.string().min(1),
});

export const CanvasElementSchema = z.object({
  id: z.string(),
  type: z.union([z.string(), z.number()]).optional(),
  shapeType: z.string().optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  color: z.union([z.string(), z.number()]).optional(),
  content: z.string().optional(),
  text: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export type CanvasElement = z.infer<typeof CanvasElementSchema>;

export type CanvasEntry = CanvasElement | null;
