import { useAuth } from "@/lib/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDeleteItemImage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { mutate: deleteItemImage, isPending } = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(
        `http://localhost:5000/api/item/image/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to delete item image");

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item"] });
      toast.success("Item image deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete item image");
    },
  });
  return { deleteItemImage, isPending };
}
