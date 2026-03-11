import { useAuth } from "@/lib/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useCreateNotification() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: createNotification, isPending } = useMutation({
    mutationFn: async (values) => {
      const res = await fetch("http://localhost:5000/api/notification/list", {
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
      if (!res.ok) throw new Error(data.err || "Failed to create notification");

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("notification created successfully");
    },
  });
  return { createNotification, isPending };
}
