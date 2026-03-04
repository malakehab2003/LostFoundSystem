import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

export function useCities() {
  const { token } = useAuth();

  const {
    data: cities,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/city/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();

      return data.citys;
    },
  });
  return { cities, isLoading, isError };
}
