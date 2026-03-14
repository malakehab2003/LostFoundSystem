import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useEditProduct() {
  const queryClient = useQueryClient();

  const { mutate: editProduct, isPending } = useMutation({
    mutationFn: async ({
      productId,
      data,
    }: {
      productId: number;
      data: any;
    }) => {
      const res = await fetch(`http://localhost:5000/api/update/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.err || "Failed to update product");

      return result;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });

      toast.success("Product updated successfully");
    },
  });

  return { editProduct, isPending };
}
