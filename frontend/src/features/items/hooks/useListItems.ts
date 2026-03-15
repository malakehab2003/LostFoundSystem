import { useQuery } from "@tanstack/react-query";
import type { ItemFilters } from "../itemsType";

export function useListItems(filters: ItemFilters) {
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });
  console.log(filters);
  const { data, isLoading, error } = useQuery({
    queryKey: ["items", filters],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/api/item/list?${query.toString()}`,
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.err || "Failed to fetch items");
      }

      return data;
    },
    keepPreviousData: true,
  });

  return {
    items: data?.allItems ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
  };
}
