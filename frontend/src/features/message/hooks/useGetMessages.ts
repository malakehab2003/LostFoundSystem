import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { useEffect } from "react";
import { useSocket } from "@/lib/SocketContext";

interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  sender: {
    id: number;
    name: string;
  };
}

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
      if (!chatId) throw new Error("Chat ID is required");

      const res = await fetch(`http://localhost:5000/api/message/list/1`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await res.json();
      return data.messages as Message[];
    },
    enabled: !!token && !!chatId,
  });

  useEffect(() => {
    if (!socket || !chatId) return;

    const handleNewMessage = (msg: any) => {
      if (msg.chat_id !== chatId) return;

      queryClient.setQueryData(
        ["messages", chatId],
        (old: Message[] | undefined) => {
          if (!old) return old;

          // Prevent duplicate messages
          const messageExists = old.some((m) => {
            // Compare based on sender, content, and timestamp
            return (
              m.sender_id === msg.sender_id &&
              m.content === msg.content &&
              new Date(m.created_at).getTime() ===
                new Date(msg.created_at).getTime()
            );
          });

          if (messageExists) return old;

          return [
            ...old,
            {
              id: msg.id || Date.now(),
              chat_id: msg.chat_id,
              sender_id: msg.sender_id,
              content: msg.content,
              is_read: false,
              created_at: msg.created_at,
              sender: {
                id: msg.sender_id,
                name: msg.sender_name,
              },
            },
          ];
        },
      );
    };

    socket.on("new_message", handleNewMessage);
    return () => socket.off("new_message", handleNewMessage);
  }, [socket, chatId, queryClient]);

  return { messages, isLoading, error };
}
