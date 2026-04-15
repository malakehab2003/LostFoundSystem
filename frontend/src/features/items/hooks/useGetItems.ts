import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

export function useGetItems() {
  const { token, user } = useAuth(); // 👈 خد user كمان

  const isAdmin = user?.role === "admin"; // 👈 حدد هل هو admin

  const {
    data: items,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["items", isAdmin], // 👈 عشان يعمل refetch لو role اتغير
    queryFn: async () => {
      const url = isAdmin
        ? "http://localhost:5000/api/item/getAllItems" // 👈 admin endpoint
        : "http://localhost:5000/api/item/getMyItems"; // 👈 user endpoint

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch items");
      }

      const data = await res.json();
      return data.items;
    },
    enabled: !!token,
  });

  return { items, isLoading, error, isAdmin };
}
