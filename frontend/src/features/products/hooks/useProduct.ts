import { useQuery } from "@tanstack/react-query";
import type { Product } from "../productType";

export function useProduct(productId: number) {
  const { data, isLoading, error } = useQuery<Product>({
    queryKey: ["products", productId],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/api/product/getProduct/${productId}`,
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to fetch product");

      return data.product;
    },
    enabled: !!productId,
  });

  return { product: data, isLoading, error };
}
