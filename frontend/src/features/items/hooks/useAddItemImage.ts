import { useAuth } from "@/lib/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface AddItemImageSchema {
  owner_id: number;
  owner_type: string;
  images: File[];
}
export function useAddItemImage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: addItemImage, isPending } = useMutation({
    mutationFn: async (values: AddItemImageSchema) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "images") return;
        else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      if (values.images?.length) {
        values.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const res = await fetch(
        "http://localhost:5000/api/item/image/addImages",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to add item images");

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item"] });
      toast.success("Item images added successfully");
    },
  });
  return { addItemImage, isPending };
}
