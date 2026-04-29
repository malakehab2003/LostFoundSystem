import { useAuth } from "@/lib/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateItemFormSchema } from "../itemsType";
import toast from "react-hot-toast";

export function useCreateItem() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: createItem, isPending } = useMutation({
    mutationFn: async (values: CreateItemFormSchema) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "images") return;
        if (key === "date" && value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      if (values.images?.length) {
        values.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const res = await fetch("http://localhost:5000/api/item/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to create item");

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item created successfully");
    },
  });
  return { createItem, isPending };
}
