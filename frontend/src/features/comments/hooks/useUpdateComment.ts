import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import toast from "react-hot-toast";

export function useUpdateComment() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    mutate: updateComment,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => {
      const res = await fetch(
        `http://localhost:5000/api/comment/update/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        },
      );

      if (!res.ok) throw new Error("Failed to update comment");

      return res.json();
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.commentId],
      });
      toast.success("Comment updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update comment. Please try again.");
    },
  });

  return {
    updateComment,
    isPending,
    error,
  };
}
