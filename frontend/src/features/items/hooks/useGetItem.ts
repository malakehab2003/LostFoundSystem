import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

export function useGetItem() {
  const { token } = useAuth();
  const {
    data: item,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userItem"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/item/getItem", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user items");
      }
      const data = await res.json();
      return data.items;
    },
    enabled: !!token,
  });

  return { items, isLoading, error };
}
