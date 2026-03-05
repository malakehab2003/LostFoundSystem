import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

export function useGovernments() {
  const { token } = useAuth();

  const {
    data: governments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["governments"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/government/list", {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      return data.governments;
    },
  });
  return { governments, isLoading, isError };
}
