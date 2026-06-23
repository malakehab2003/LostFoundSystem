import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UpdateProfileFormSchema } from "@/features/auth/userType";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export function useUpdateUserInfo() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: updateUserInfo, isPending } = useMutation({
    mutationFn: async (values: UpdateProfileFormSchema) => {
      const response = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Profile updated successfully!");
      navigate("/dashboard/info");
    },
    onError: (err: any) => {
      console.error("Error updating user:", err);
      toast.error("Failed to update profile. Please try again.");
    },
  });
  return { updateUserInfo, isPending };
}
