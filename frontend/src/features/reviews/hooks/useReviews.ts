import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


export function useProductReviews(productId: number) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/review/product/list/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to fetch reviews");
      return data.reviews || [];
    },
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, message, rate, image }) => {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("product_id", String(productId));
      formData.append("message", message);
      formData.append("rate", String(rate));
      if (image) formData.append("image", image);

      const res = await fetch("http://localhost:5000/api/review/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to create review");

      return data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.productId],
      });

      queryClient.refetchQueries({
        queryKey: ["reviews", variables.productId],
      });

      toast.success("Review added successfully!");
    },
  });
}
