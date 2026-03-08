import { useAuth } from "@/lib/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EditAddressFormSchema } from "../addressType";
import toast from "react-hot-toast";

export function useEditAddress() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: editAddress, isPending } = useMutation({
    mutationFn: async ({
      id,
      ...values
    }: { id: number } & EditAddressFormSchema) => {
      const res = await fetch(
        `http://localhost:5000/api/address/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...values,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to update address");

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address updated successfully");
    },
  });
  return { editAddress, isPending };
}
