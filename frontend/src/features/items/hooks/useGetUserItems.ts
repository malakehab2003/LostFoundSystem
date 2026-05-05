import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

export function useGetUserItems(userId: number) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["items", userId],

    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/api/item/list?type=lost`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      return data.allItems || [];
    },

    enabled: !!token && !!userId,

    staleTime: 1000 * 60 * 5,
  });
}