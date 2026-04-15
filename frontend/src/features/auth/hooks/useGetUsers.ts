import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

export function useGetUsers() {
  const { token } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["users-with-items"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/user/searchUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      return res.json();
    },
    enabled: !!token,
  });

  return {
    users: data?.users,
    isLoading,
    error,
  };
}
