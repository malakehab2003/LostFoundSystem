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
  
  const cleanFilters = Object.fromEntries(
    Object.entries(filters)
      .filter(([_, v]) => v !== undefined && v !== "" && v !== null && v !== 0)
      .map(([k, v]) => [k, String(v)])
  );

  const queryString = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...cleanFilters,
  }).toString();

  const { data, isLoading, refetch } = useQuery<{
    products: any[];
    pagination: PaginationData;
  }>({
    queryKey: ["products", page, limit, filters], 
    queryFn: async () => {
      const url = `http://localhost:5000/api/product/list?${queryString}`;
      console.log("Fetching products with URL:", url);
      
      const res = await fetch(url);

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