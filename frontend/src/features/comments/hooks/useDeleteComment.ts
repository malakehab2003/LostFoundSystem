import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import toast from "react-hot-toast";

export function useDeleteComment() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    mutate: deleteComment,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ commentId }: { commentId: number }) => {
      const res = await fetch(
        `http://localhost:5000/api/comment/delete/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to delete comment");

      return res.json();
    },

    onSuccess: (_, variables: any) => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
      toast.success("Comment deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete comment. Please try again.");
    },
  });

  return {
    deleteComment,
    isPending,
    error,
  };
}
