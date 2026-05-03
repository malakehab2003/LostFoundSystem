// features/products/hooks/useAddProductImage.ts - Complete working version
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type AddImagePayload = {
  productId: number;
  image: File;
};

export function useAddProductImage() {
  const queryClient = useQueryClient();

  const { mutate: addImage, isPending } = useMutation({
    mutationFn: async ({ productId, image }: AddImagePayload) => {
      const formData = new FormData();
      formData.append("images", image);
      formData.append("product_id", String(productId));

      console.log("Adding image for product:", productId);
      console.log("Image file:", image.name);

      // ✅ Correct endpoint for product image
      const res = await fetch("http://localhost:5000/api/product/image/addImages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const result = await res.json();
      console.log("Add image response:", result);

      if (!res.ok) {
        throw new Error(result.err || result.message || "Failed to add image");
      }

      return result;
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      toast.success("Image added successfully");
    },

    onError: (err: any) => {
      console.error("Add image error:", err);
      toast.error(err.message || "Failed to add image");
    },
  });

  return { addImage, isPending };
}