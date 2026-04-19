import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { useEffect } from "react";
import { useSocket } from "@/lib/SocketContext";
interface Chat {
  chat_id: number;
  other_user: {
    id: number;
    name: string;
    image_url?: string;
  };
  last_message: string | null;
  unread: number;
}

export function useGetChats() {
  const { token } = useAuth();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const {
    data: chats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/chat/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch chats");
      }

      const data = await res.json();
      return data.formattedChats;
    },
    enabled: !!token,
  });

  // useEffect(() => {
  //   if (!socket) return;

  //   const handleNewMessage = (msg: any) => {
  //     queryClient.setQueryData(["chats"], (old) => {
  //       if (!old) return old;

  //       // Update the chat to reflect the new message
  //       return old.map((chat) =>
  //         chat.id === msg.chat_id
  //           ? { ...chat, updated_at: new Date().toISOString() }
  //           : chat,
  //       );
  //     });
  //   };

  //   socket.on("new_message", handleNewMessage);
  //   return () => socket.off("new_message", handleNewMessage);
  // }, [socket, queryClient]);

  return { chats, isLoading, error };
}
