import { useAuth } from "@/lib/AuthContext";
import { useQuery } from "@tanstack/react-query";

export function useCountNotifications() {
  const { token } = useAuth();
  const {
    data: notificationsCount,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notificationsCount"],
    queryFn: async () => {
      const res = await fetch(
        "http://localhost:5000/api/notification/notRead",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.err || "Failed to count unread notifications");

      return data.count;
    },
  });
  return { notificationsCount, isLoading, error };
}
