// features/items/hooks/useGetItem.ts - منتج واحد محدد
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import type { Item } from "../itemsType";

export function useGetItem(itemId: number) {
  const { token } = useAuth();
  const {
    data: item,
    isLoading,
    error,
  } = useQuery<Item>({
    queryKey: ["item", itemId],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/api/item/getItem/${itemId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch item");
      }
      const data = await res.json();
      return data.item;
    },
    enabled: !!token && !!itemId,
  });

  return { item, isLoading, error };
}