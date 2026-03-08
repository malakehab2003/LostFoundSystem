import { useAuth } from "@/lib/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateItemFormSchema } from "../itemsType";
import toast from "react-hot-toast";

export function useCreateItem() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: createItem, isPending } = useMutation({
    mutationFn: async (values: CreateItemFormSchema) => {
      const res = await fetch("http://localhost:5000/api/item/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          date: values.date.toISOString(),
        }),
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
