import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import type { ChangePasswordFormSchema } from "../userType";

export function useChangePassword() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const navigate = useNavigate();

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: async (values: ChangePasswordFormSchema) => {
      const res = await fetch("http://localhost:5000/api/user/chagePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Password changed successfully!");
      navigate("/dashboard");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.message || "Failed to change password");
    },
  });
  return { changePassword, isPending };
}
