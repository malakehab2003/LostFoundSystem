// features/products/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import type { ProductFilters } from "../productType";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function useProducts(
  page: number = 1,
  limit: number = 10,
  filters: ProductFilters = {}
) {
  const queryString = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...Object.entries(filters)
      .filter(([_, v]) => v !== undefined && v !== "")
      .reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {}),
  }).toString();

  const { data, isLoading, refetch } = useQuery<{
    products: any[];
    pagination: PaginationData;
  }>({
    queryKey: ["products", page, limit, filters], // 🔥 FIX مهم
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/api/product/list?${queryString}`
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.err || "Failed to fetch products");

      let products: any[] = [];
      let total = 0;

      if (data?.products?.rows) {
        products = data.products.rows;
        total = data.products.count || products.length;
      } else if (Array.isArray(data?.products)) {
        products = data.products;
        total = data.pagination?.total || products.length;
      } else if (Array.isArray(data)) {
        products = data;
        total = products.length;
      }

      const currentPage = data?.pagination?.page || page;
      const currentLimit = data?.pagination?.limit || limit;

      let totalPages = data?.pagination?.totalPages;
      if (!totalPages && total > 0) {
        totalPages = Math.ceil(total / currentLimit);
      }

      return {
        products,
        pagination: {
          page: currentPage,
          limit: currentLimit,
          total,
          totalPages: totalPages || 1,
        },
      };
    },
  });

  return {
    products: data?.products,
    pagination: data?.pagination,
    isLoading,
    refetch,
  };
}