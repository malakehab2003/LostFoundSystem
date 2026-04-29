// features/products/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import type { Product, ProductFilters } from "../productType";

export function useProducts(filters: ProductFilters = {}) {
  const queryString = new URLSearchParams(
    Object.entries(filters)
      .filter(([_, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)]),
  ).toString();

  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["products", filters],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/api/product/list${
          queryString ? `?${queryString}` : ""
        }`,
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to fetch products");

      
      return data?.products ?? [];

    },
  });

  return { products: data, isLoading };
}