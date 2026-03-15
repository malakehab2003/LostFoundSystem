import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import toast from "react-hot-toast";

export function useAddToWishlist() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: addToWishlist, isPending } = useMutation({
    mutationFn: async (productId: number) => {
      const res = await fetch(`http://localhost:5000/api/wishlist/addProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.err || "Failed to add the product to wishlist");

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Product added to wishlist");
    },
  });

  return { addToWishlist, isPending };
}
