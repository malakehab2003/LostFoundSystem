import { useAuth } from "@/lib/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateAddressFormSchema } from "../addressType";
import toast from "react-hot-toast";

export function useCreateAddress() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: createAddress, isPending } = useMutation({
    mutationFn: async (values: CreateAddressFormSchema) => {
      const res = await fetch("http://localhost:5000/api/address/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to create address");

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address created successfully");
    },
  });
  return { createAddress, isPending };
}
