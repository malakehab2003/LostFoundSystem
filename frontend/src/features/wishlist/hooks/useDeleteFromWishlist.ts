import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import toast from "react-hot-toast";

export function useDeleteFromWishlist() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: deleteFromWishlist, isPending } = useMutation({
    mutationFn: async (productId: number) => {
      const res = await fetch(
        `http://localhost:5000/api/wishlist/delete/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.err || "Failed to remove from wishlist");

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Removed from wishlist");
    },
  });

  return { deleteFromWishlist, isPending };
}
