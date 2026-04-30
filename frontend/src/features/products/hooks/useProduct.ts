// features/products/hooks/useProduct.ts
import { useQuery } from "@tanstack/react-query";
import type { Product } from "../productType";

export function useProduct(productId: number) {
  const { data, isLoading, error } = useQuery<Product>({
    queryKey: ["products", productId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      
      const res = await fetch(
        `http://localhost:5000/api/product/getProduct/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to fetch product");

      return data.product || data;
    },
    enabled: !!productId,
  });

  return { product: data, isLoading, error };
}