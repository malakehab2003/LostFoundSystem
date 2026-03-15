import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

export function useWishlistToggle() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      isInWishlist,
    }: {
      productId: number;
      isInWishlist: boolean;
    }) => {
      const res = await fetch(
        isInWishlist
          ? `http://localhost:5000/api/wishlist/delete/${productId}`
          : `http://localhost:5000/api/wishlist/addProduct`,
        {
          method: isInWishlist ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: isInWishlist
            ? undefined
            : JSON.stringify({ product_id: productId }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.err);
      return data;
    },

    onMutate: async ({ productId, isInWishlist }) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      const prev = queryClient.getQueryData<any[]>(["wishlist"]);

      queryClient.setQueryData(["wishlist"], (old: any[] = []) => {
        if (isInWishlist) {
          return old.filter((i) => i.product_id !== productId);
        }
        return [...old, { product_id: productId }];
      });

      return { prev };
    },

    onError: (_, __, ctx) => {
      queryClient.setQueryData(["wishlist"], ctx?.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}
