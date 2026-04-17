import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(500, "Message is too long"),
});

export type MessageFormSchema = z.infer<typeof messageSchema>;
