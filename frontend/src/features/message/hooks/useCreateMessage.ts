import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

interface CreateMessageInput {
  content: string;
  chat_id: number;
}

interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
}

export function useCreateMessage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    mutate: sendMessage,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ content, chat_id }: CreateMessageInput) => {
      const res = await fetch("http://localhost:5000/api/message/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, chat_id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.err || "Failed to send message");
      }

      const data = await res.json();
      return data.message as Message;
    },
    onSuccess: (message) => {
      // Invalidate messages for this chat to refresh
      queryClient.invalidateQueries({
        queryKey: ["messages", message.chat_id],
      });

      // Update chats list
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });

  return { sendMessage, isPending, error };
}
