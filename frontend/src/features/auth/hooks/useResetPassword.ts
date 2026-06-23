import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import type { ResetPasswordFormSchema } from "../userType";
import { useNavigate } from "react-router-dom";

export function useResetPassword() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const navigate = useNavigate();

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: async (values: ResetPasswordFormSchema) => {
      const res = await fetch("http://localhost:5000/api/user/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.err || "Failed to reset password");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Password has been reset successfully");
      navigate("/login");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.message || "Failed to reset password");
    },
  });
  return { resetPassword, isPending };
}
