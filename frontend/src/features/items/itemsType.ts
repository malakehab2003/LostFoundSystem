import { z } from "zod";

export const CreateItemSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),

    description: z.string().max(500, "Description is too long").optional(),

    place: z.string().min(1, "Place is required").max(255),

    category_id: z.coerce
      .number({
        required_error: "Category is required",
      })
      .int("Invalid category")
      .positive("Invalid category"),

    government_id: z.coerce.number().int().positive().optional(),

    city_id: z.coerce.number().int().positive().optional(),

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

export const EditItemSchema = z
  .object({
    title: z.string().min(1).max(255).optional(),

    description: z.string().max(500).optional(),

    place: z.string().min(1).max(255).optional(),

    category_id: z.coerce.number().int().positive().optional(),

    government_id: z.coerce.number().int().positive().optional(),

    city_id: z.coerce.number().int().positive().optional(),

    type: z
      .enum(["lost", "found"], {
        errorMap: () => ({ message: "Type must be lost or found" }),
      })
      .optional(),

    date: z
      .preprocess(
        (val) => (typeof val === "string" ? new Date(val) : val),
        z.date(),
      )
      .refine((date) => date <= new Date(), {
        message: "Date cannot be in the future",
      })
      .optional(),
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
export type EditItemFormSchema = z.infer<typeof EditItemSchema>;

export interface ItemCategory {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

export interface Government {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
}

export interface ItemImage {
  id?: number;
  image_url?: string;
}

export interface Comment {
  id?: number;
  content?: string;
}

export interface Item {
  id: number;
  title: string;
  description: string | null;
  type: "lost" | "found";
  date: string;
  place: string;

  item_category_id: number;
  city_id: number;
  government_id: number;
  user_id: number;

  created_at: string;
  updated_at: string;

  category: ItemCategory;
  city: City;
  government: Government;
  user: User;

  images: ItemImage[];
  comments: Comment[];
}
