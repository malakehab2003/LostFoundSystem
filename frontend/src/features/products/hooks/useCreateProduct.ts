import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { CreateProductForm } from "../productType";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  const { mutate: createProduct, isPending } = useMutation({
    mutationFn: async (productData: CreateProductForm) => {
      const res = await fetch("http://localhost:5000/api/product/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to create product");

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
    },
  });

  return { createProduct, isPending };
}
