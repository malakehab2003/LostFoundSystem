import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type LoginFormSchema } from "@/features/auth/type";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const queryClient = useQueryClient();
  const { login } = useAuth();
  const navigate = useNavigate();

  const { mutate: loginUser } = useMutation({
    mutationFn: async (values: LoginFormSchema) => {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to login");
      return data;
    },
    onSuccess: (data) => {
      login(data.token);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      toast.success("Logged in successfully!");
      navigate("/");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.message || "Failed to log in");
    },
  });
  return { loginUser };
}
