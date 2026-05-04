// features/auth/hooks/useMakeAdmin.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useMakeAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      const token = localStorage.getItem("token");

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
        throw new Error(data.message || data.err || "Failed");
      }

      return { data, userId };
    },

    // ✅ Optimistic Update
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData(["users"]);

      queryClient.setQueryData(["users"], (oldUsers: any[] = []) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.map((user: any) =>
          user.id === userId ? { ...user, role: "admin" } : user
        );
      });

      return { previousUsers };
    },

    onSuccess: ({ data, userId }) => {
      queryClient.setQueryData(["users"], (oldUsers: any[] = []) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.map((user: any) =>
          user.id === userId ? { ...user, role: "admin" } : user
        );
      });
      toast.success("User promoted to admin");
    },

    onError: (err, userId, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
      toast.error(err.message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}