import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/AuthContext";
import type { Brand } from "./useBrands";

export function useUpdateBrand() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const res = await fetch(`http://localhost:5000/api/brand/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.err || "Failed to update brand");
      }

      return data.brand;
    },
    onSuccess: (updatedBrand) => {
      queryClient.setQueryData(["brands"], (oldBrands: Brand[] = []) => {
        return oldBrands.map((brand) =>
          brand.id === updatedBrand.id ? updatedBrand : brand
        );
      });
      toast.success("Brand updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update brand");
    },
  });
}