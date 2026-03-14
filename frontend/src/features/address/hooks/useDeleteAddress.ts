import { useAuth } from "@/lib/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDeleteAddress() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: deleteAddress, isPending } = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(
        `http://localhost:5000/api/address/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to create address");

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address deleted successfully");
    },
  });
  return { deleteAddress, isPending };
}
