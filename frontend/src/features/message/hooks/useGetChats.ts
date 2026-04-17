import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/lib/AuthContext";

export function useGetChats() {
  const { token } = useAuth();
  const {
    data: chats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/api/chat/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to get chats");
      }
      const data = await res.json();
      return data;
    },
    enabled: !!token,
  });
  return { chats, isLoading, error };
}
