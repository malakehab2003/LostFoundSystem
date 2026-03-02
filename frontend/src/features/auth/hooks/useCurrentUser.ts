import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

export function useCurrentUser() {
  const { token } = useAuth();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/user/getMe", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
  return { user, isLoading, isError };
}
