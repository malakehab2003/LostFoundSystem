import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(255),

  description: z.string().min(10, "Description must be at least 10 characters"),

  price: z.coerce.number().positive("Price must be positive"),

  sale: z.coerce.number().min(0).max(100).optional(),

  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),

  brand_id: z.coerce.number().int().positive(),

  category_id: z.coerce.number().int().positive(),

  rate: z.coerce.number().min(0).max(5).optional(),

  colors: z.array(z.string()).optional(),

  images_url: z
    .array(z.string().url())
    .min(1, "At least one image is required"),
});

export const EditProductSchema = z.object({
  name: z.string().min(2).max(255).optional(),

  description: z.string().min(10).optional(),

  price: z.coerce.number().positive().optional(),

  sale: z.coerce.number().min(0).max(100).optional(),

  stock: z.coerce.number().int().min(0).optional(),

  brand_id: z.coerce.number().int().positive().optional(),

  category_id: z.coerce.number().int().positive().optional(),

  rate: z.coerce.number().min(0).max(5).optional(),

  colors: z.array(z.string()).optional(),

  images_url: z.array(z.string().url()).optional(),
});

export type CreateProductForm = z.infer<typeof CreateProductSchema>;
export type EditProductForm = z.infer<typeof EditProductSchema>;

export type ProductListResponse = {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  sale: number;
  stock: number;
  brand_id: number;
  product_category_id: number;
  rate?: number;
  status?: "active" | "inactive";
  colors?: string[];
  createdAt?: string;
  updatedAt?: string;
};
export type ProductImage = {
  id: number;
  product_id: number;
  url: string;
};
export type ProductFilters = {
  status?: "active" | "inactive";
  min_price?: number;
  max_price?: number;
  category_id?: number;
  brand_id?: number;
  rate?: number;
  name?: string;
  colors?: string;
  page?: number;
};
