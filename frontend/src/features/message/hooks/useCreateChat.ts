import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";

export function useCreateChat() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    mutate: createChat,
    isPending,
    error,
    data,
  } = useMutation({
    mutationFn: async (receiverId: number) => {
      const res = await fetch("http://localhost:5000/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver_id: receiverId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.err || "Failed to create chat");
      }

      const data = await res.json();
      // 🔥 2. Try to extract chatId directly
      const chatId = data?.chat?.id || data?.chat_id || data?.id;
      console.log("chats in usecreate", chatId);

      return { chatId };
    },
    onSuccess: ({ chatId }) => {
      // 🔥 ensure chats list is updated
      queryClient.invalidateQueries({ queryKey: ["chats"] });

      // 🔥 redirect immediately
      navigate(`/dashboard/messages?chatId=${chatId}`);
    },

    onError: (error) => {
      console.error("Error creating chat:", error);
    },
  });

  return { createChat, isPending, error, data };
}
