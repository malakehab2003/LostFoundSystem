import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import toast from "react-hot-toast";
import type { EditItemFormSchema } from "../itemsType";

export function useEditItem() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: editItem, isPending } = useMutation({
    mutationFn: async ({
      itemId,
      ...values
    }: { itemId: number } & EditItemFormSchema) => {
      console.log("item in edit item", values);

      const res = await fetch(
        `http://localhost:5000/api/item/update/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...values,
            date: values?.date?.toISOString(),
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to update the item");

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item updated successfully");
    },
  });
  return { editItem, isPending };
}
