import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

export function useGetItemCategory() {
  const { token } = useAuth();

  const {
    data: itemCategories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["itemCategories"],
    queryFn: async () => {
      const res = await fetch(
        "http://localhost:5000/api/product/category/list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();

      return data;
    },
  });
  return { itemCategories, isLoading, isError };
}
