// features/admin/hooks/useAdminDashboard.ts
import { useQuery } from "@tanstack/react-query";

export function useAdminDashboard() {
  const token = localStorage.getItem("token");
  
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return data;
    },
  });
}

export function useMonthlyOrders(month: string, year: string) {
  const token = localStorage.getItem("token");
  
  return useQuery({
    queryKey: ["monthly-orders", month, year],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/api/dashboard/month-orders?month=${month}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      return data;
    },
    enabled: !!month && !!year,
  });
}