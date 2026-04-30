import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type EditProductPayload = {
  productId: number;
  data: FormData | {
    name?: string;
    price?: number;
    description?: string;
    stock?: number;
  };
};

export function useEditProduct() {
  const queryClient = useQueryClient();

  const { mutate: editProduct, isPending } = useMutation({
    mutationFn: async ({ productId, data }: EditProductPayload) => {
      const isFormData = data instanceof FormData;

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

      if (!res.ok) {
        throw new Error(result.err || "Failed to update product");
      }

      return result;
    },

    onSuccess: (data, variables) => {
      // 🔥 تحديث سريع للـ UI (مهم جدًا)
      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return old;

        return old.map((p: any) =>
          p.id === variables.productId
            ? { ...p, ...data.product } // لازم API يرجع product
            : p
        );
      });

      queryClient.invalidateQueries({ queryKey: ["products"] });

      toast.success("Product updated successfully");
    },

    onError: (err: any) => {
      toast.error(err.message || "Update failed");
    },
  });

  return { editProduct, isPending };
}