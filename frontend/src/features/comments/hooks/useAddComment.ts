import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import toast from "react-hot-toast";

export function useAddComment() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    mutate: addComment,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({
      itemId,
      content,
    }: {
      itemId: number;
      content: string;
    }) => {
      const res = await fetch("http://localhost:5000/api/comment/addComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId,
          content,
        }),
      });

      if (!res.ok) throw new Error("Failed to add comment");

      return res.json();
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.itemId],
      });
      toast.success("Comment added successfully!");
    },
    onError: () => {
      toast.error("Failed to add comment. Please try again.");
    },
  });

  return {
    addComment,
    isPending,
    error,
  };
}
