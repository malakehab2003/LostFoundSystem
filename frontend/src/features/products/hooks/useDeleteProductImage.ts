import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type DeleteImagePayload = {
  imageId: number;
  productId: number;
};

export function useDeleteProductImage() {
  const queryClient = useQueryClient();

  const { mutate: deleteImage, isPending } = useMutation({
    mutationFn: async ({ imageId }: DeleteImagePayload) => {
      // جرب واحد من الروابط دي
      const res = await fetch(`http://localhost:5000/api/product/image/delete/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.err || "Failed to delete image");
      }

      return result;
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Image deleted successfully");
    },

    onError: (err: any) => {
      toast.error(err.message || "Failed to delete image");
    },
  });

  return { deleteImage, isPending };
}