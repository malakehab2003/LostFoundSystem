import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  const { mutate: deleteProduct, isPending } = useMutation({
    mutationFn: async (productId: number) => {
      const res = await fetch(`http://localhost:5000/delete/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to delete product");

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
  });

  return { deleteProduct, isPending };
}
