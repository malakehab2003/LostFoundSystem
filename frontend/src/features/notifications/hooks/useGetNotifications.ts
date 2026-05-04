import { useAuth } from "@/lib/AuthContext";
import { useQuery } from "@tanstack/react-query";

interface Notification {
  id: number;
  description: string;
  message: string;
  is_read: boolean;
  entity?: string;
  entity_id?: number;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export function useGetNotifications() {
  const { token } = useAuth();

  const {
    data: notifications = [],
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
