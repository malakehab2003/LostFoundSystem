// features/brands/hooks/useDeleteBrand.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/AuthContext";
import type { Brand } from "./useBrands";

export function useDeleteBrand() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`http://localhost:5000/api/brand/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.err || "Failed to delete brand");
      }

      return { id, message: data.message };
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(["brands"], (oldBrands: Brand[] = []) => {
        return oldBrands.filter((brand) => brand.id !== id);
      });
      toast.success("Brand deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete brand");
    },
  });
}