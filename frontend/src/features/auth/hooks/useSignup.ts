import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { type SignupFormSchema } from "@/features/auth/userType";
import { useNavigate } from "react-router-dom";

export function useSignup() {
  const navigate = useNavigate();

  const { mutate: signupUser, isPending } = useMutation({
    mutationFn: async (values: SignupFormSchema) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "image") return; // Handle separately
        if (key === "dob" && value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== undefined && value !== "") {
          formData.append(key, String(value));
        }
      });

      if (values.image?.length) {
        formData.append("image", values.image[0]);
      }

      const response = await fetch(
        "http://localhost:5000/api/user/createUser",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    },
    onError: (err: any) => {
      console.error("Error creating user:", err);
      toast.error("Failed to create account. Please try again.");
    },
  });
  return { signupUser, isPending };
}
