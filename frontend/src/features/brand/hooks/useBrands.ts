// features/brands/hooks/useBrands.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

export interface Brand {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export function useBrands() {
  const { token } = useAuth();

  const {
    data: brands,
    isLoading,
    error,
    refetch,
  } = useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/brand/list", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch brands");
      }
      const data = await res.json();
      return data.brands || [];
    },
    enabled: !!token,
  });

  return { brands, isLoading, error, refetch };
}