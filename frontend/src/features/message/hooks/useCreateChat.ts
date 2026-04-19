import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

interface Chat {
  id: number;
  sender_id: number;
  receiver_id: number;
  created_at: string;
}

export function useCreateChat() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

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
      return data.chat as Chat;
    },
    onSuccess: (chat) => {
      // Invalidate and refetch chats
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error) => {
      console.error("Error creating chat:", error);
    },
  });

  return { createChat, isPending, error, data };
}
