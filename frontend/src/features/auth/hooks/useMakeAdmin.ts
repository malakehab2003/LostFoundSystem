import { useAuth } from "@/lib/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useMakeAdmin() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { mutate: makeAdmin, isPending } = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch("http://localhost:5000/api/user/createAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || data.err || "Failed to promote user to admin",
        );
      }

      return data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User promoted to admin");
    },

    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
  return { makeAdmin, isPending };
}
