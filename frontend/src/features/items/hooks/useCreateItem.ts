import { useAuth } from "@/lib/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateItemFormSchema } from "../itemsType";

export function useCreateItem() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: createItem, isPending } = useMutation({
    mutationFn: async (values: CreateItemFormSchema) => {
      const res = await fetch("/api/item/create", {
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
      queryClient.invalidateQueries({ queryKey: ["userItems"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
  return { createItem, isPending };
}
