import { useAuth } from "@/lib/AuthContext";
import { useSocket } from "@/lib/SocketContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateMessage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const socket = useSocket();

  const { mutate: createMessage, isPending } = useMutation({
    mutationFn: async ({
      content,
      chatId,
    }: {
      content: string;
      chatId: number;
    }) => {
      const res = await fetch("http://localhost:5000/api/message/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chat_id: chatId,
          content,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.err);

      return data;
    },

    onMutate: async ({ content, chatId }) => {
      await queryClient.cancelQueries({ queryKey: ["messages", chatId] });

      const previous = queryClient.getQueryData(["messages", chatId]);
      const tempId = Date.now();
      const optimisticMessage = {
        id: tempId,
        content,
        chat_id: chatId,
        pending: true,
      };

      queryClient.setQueryData(["messages", chatId], (old: any) => [
        ...(old || []),
        optimisticMessage,
      ]);

      return { previous, tempId };
    },

    onError: (_err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["messages", variables.chatId],
          context.previous,
        );
      }
    },
    onSuccess: (data, variables, context) => {
      // REMOVE: socket?.emit("sendMessage", data);

      queryClient.setQueryData(["messages", variables.chatId], (old: any) =>
        old?.map(
          (msg: any) => (msg.id === context?.tempId ? data.message : msg), // Access data.message
        ),
      );
    },
  });

  return { createMessage, isPending };
}
