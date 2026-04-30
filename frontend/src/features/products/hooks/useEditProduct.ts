// features/products/hooks/useEditProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type EditProductPayload = {
  productId: number;
  data: FormData | {
    name?: string;
    price?: number;
    description?: string;
    stock?: number;
    category_id?: number;
  };
};

export function useEditProduct() {
  const queryClient = useQueryClient();

  const { mutate: editProduct, isPending } = useMutation({
    mutationFn: async ({ productId, data }: EditProductPayload) => {
      const isFormData = data instanceof FormData;

      console.log("Updating product:", productId);
      console.log("Data being sent:", data);

      const res = await fetch(
        `http://localhost:5000/api/product/update/${productId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
          },
          body: isFormData ? data : JSON.stringify(data),
        }
      );

      const result = await res.json();
      console.log("Update response:", result);

      if (!res.ok) {
        throw new Error(result.err || result.message || "Failed to update product");
      }

      return result;
    },

    onSuccess: (data, variables) => {
      const updatedProduct = data.product || data;
      
      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return old;
        
        if (Array.isArray(old)) {
          return old.map((p: any) =>
            p.id === variables.productId
              ? { ...p, ...updatedProduct }
              : p
          );
        }
        
        return old;
      });

      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
    },

    onError: (err: any) => {
      console.error("Update error:", err);
      toast.error(err.message || "Update failed");
    },
  });

  return { editProduct, isPending };
}