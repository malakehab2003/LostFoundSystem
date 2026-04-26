import { useAuth } from "@/lib/AuthContext";
import { useQuery } from "@tanstack/react-query";

export function useGetNotifications() {
  const { token } = useAuth();

  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/notification/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.err || "Failed to retrieve notifications");

      return data.notifications;
    },
  });
  return { notifications, isLoading, error };
}
