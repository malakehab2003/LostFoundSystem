import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

export function useGetAddresses() {
  const { token } = useAuth();

  const {
    data: addresses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/address/list", {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();

      return data.addresses;
    },
  });
  return { addresses, isLoading, isError };
}
