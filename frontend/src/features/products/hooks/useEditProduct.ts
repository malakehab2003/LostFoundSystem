import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type EditProductPayload = {
  productId: number;
  data: {
    name?: string;
    price?: number;
    description?: string;
    image?: string[];
    category?: string;
  };
};

export function useEditProduct() {
  const queryClient = useQueryClient();

  const { mutate: editProduct, isPending } = useMutation({
    mutationFn: async ({ productId, data }: EditProductPayload) => {
      const res = await fetch(
        `http://localhost:5000/api/product/update/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.err || "Failed to update product");
      }

      return result;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });

      toast.success("Product updated successfully");
    },

    onError: (err: any) => {
      toast.error(err.message || "Update failed");
    },
  });

  return { editProduct, isPending };
}
