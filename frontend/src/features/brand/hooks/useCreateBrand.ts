import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/AuthContext";

export function useCreateBrand() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("http://localhost:5000/api/brand/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.err || "Failed to create brand");
      }

      return data.brand;
    },
    onSuccess: (newBrand) => {
      queryClient.setQueryData(["brands"], (oldBrands: Brand[] = []) => {
        return [newBrand, ...oldBrands];
      });
      toast.success("Brand created successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create brand");
    },
  });
}