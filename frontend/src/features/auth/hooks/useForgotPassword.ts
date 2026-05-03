import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import type { ForgotPasswordFormSchema } from "../userType";
import { useNavigate } from "react-router-dom";

export function useForgotPassword() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { mutate: forgotPassword, isPending } = useMutation({
    mutationFn: async (values: ForgotPasswordFormSchema) => {
      console.log(values);
      const res = await fetch(
        "http://localhost:5000/api/user/forget-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.err || "Failed to send an email");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Email with OTP has been sent to your inbox");
      navigate("/reset-password");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.message || "Failed to send an email");
    },
  });
  return { forgotPassword, isPending };
}
