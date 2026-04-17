import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/lib/AuthContext";
import { useEffect } from "react";
import { useSocket } from "@/lib/SocketContext";

export function useGetMessages(chatId: number) {
  const { token } = useAuth();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/api/message/list/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("res", res);
      if (!res.ok) {
        throw new Error("Failed to get chat messages");
      }
      const data = await res.json();
      return data.message;
    },
    enabled: !!token && !!chatId,
  });
  useEffect(() => {
    if (!socket) return;

    // Listen to 'new_message' (matches backend)
    const handler = (msg: any) => {
      if (msg.chat_id !== chatId) return;

      queryClient.setQueryData(["messages", chatId], (old: any) => {
        // DOUBLE RECEIPT CHECK:
        // Check if the message (by ID) already exists in our optimistic update
        const exists = old?.some((m: any) => m.id === msg.id);
        if (exists) return old;

        return [...(old || []), msg];
      });
    };

    socket.on("new_message", handler);
    return () => socket.off("new_message", handler);
  }, [socket, chatId, queryClient]);

  return { messages, isLoading, error };
}
