// useGetComments.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

export function useGetComments(itemId: number) {
  const { token } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["comments", itemId],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/api/comment/get/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch comments");

      return res.json();
    },
    enabled: !!token && !!itemId,
  });

  return {
    comments: data?.comments,
    isLoading,
    error,
  };
}
