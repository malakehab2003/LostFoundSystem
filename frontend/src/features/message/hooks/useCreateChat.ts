import { useAuth } from "@/lib/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useCreateChat() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: createChat, isPending } = useMutation({
    mutationFn: async (senderId: number) => {
      console.log("senderID:", senderId);
      const res = await fetch("http://localhost:5000/api/chat/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender_id: senderId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to create the chat");

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      toast.success("chat has been sent successfully");
    },
  });
  return { createChat, isPending };
}
