// features/products/hooks/useCreateProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { CreateProductForm } from "../productType";

// Image upload function
const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/product/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.err || "Failed to upload image");
  return data.image_url || data.url;
};

export function useCreateProduct() {
  const queryClient = useQueryClient();

  const { mutate: createProduct, isPending, mutateAsync: createProductAsync } = useMutation({
    mutationFn: async (productData: CreateProductForm & { imageFile?: File }) => {
      let uploadedImageUrl = "";
      
      // Upload image if provided
      if (productData.imageFile) {
        try {
          uploadedImageUrl = await uploadImage(productData.imageFile);
        } catch (error) {
          throw new Error("Failed to upload image");
        }
      }
      
      // Prepare product data without the imageFile
      const { imageFile, ...productDataWithoutImage } = productData;
      
      const finalProductData = {
        ...productDataWithoutImage,
        images_url: uploadedImageUrl ? [uploadedImageUrl] : [],
      };
      
      console.log("Sending product data:", finalProductData);
      
      const res = await fetch(
        "http://localhost:5000/api/product/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(finalProductData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.err || "Failed to create product");
      }

      return data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
    },

    onError: (err: any) => {
      toast.error(err.message || "Create failed");
    },
  });

  return { createProduct, createProductAsync, isPending };
}