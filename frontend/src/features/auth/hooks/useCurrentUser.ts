import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

export function useCurrentUser() {
  const { token } = useAuth();

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No token found");
      }
      
      const res = await fetch("http://localhost:5000/api/user/getMe", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized - Please login again");
        }
        throw new Error("Failed to fetch user");
      }
      
      const data = await res.json();
      return data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
  
  return { 
    user, 
    isLoading, 
    isError, 
    error,
    refetch 
  };
}