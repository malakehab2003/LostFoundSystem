import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const { logout, token } = useAuth();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate: logoutUser } = useMutation({
    mutationFn: async () => {
      const res = await fetch("http://localhost:5000/api/user/logOut", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to logout");
      return res.json();
    },
    onSuccess: () => {
      logout();
      queryClient.setQueryData(["currentUser"], null);
      toast.success("Logged out successfully!");
      navigate("/");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.message || "Failed to log out");
    },
  });
  return { logoutUser };
}
