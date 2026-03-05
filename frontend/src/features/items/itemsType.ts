import { z } from "zod";

export const CreateItemSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),

    description: z.string().max(1000, "Description is too long").optional(),

    place: z.string().min(1, "Place is required").max(255),

    category_id: z
      .number({
        required_error: "Category is required",
      })
      .int("Invalid category")
      .positive("Invalid category"),

    government_id: z.number().int().positive().optional(),

    city_id: z.number().int().positive().optional(),

    type: z.enum(["lost", "found"], {
      errorMap: () => ({ message: "Type must be lost or found" }),
    }),

    date: z
      .preprocess(
        (val) => (typeof val === "string" ? new Date(val) : val),
        z.date(),
      )
      .refine((date) => date <= new Date(), {
        message: "Date cannot be in the future",
      }),

    images_url: z.array(z.string().url()).optional(),
  })
  .refine(
    (data) => {
      // If government exists, city must exist
      if (data.government_id && !data.city_id) {
        return false;
      }
      return true;
    },
    {
      message: "City is required when government is selected",
      path: ["city_id"],
    },
  );
export type CreateItemFormSchema = z.infer<typeof CreateItemSchema>;
