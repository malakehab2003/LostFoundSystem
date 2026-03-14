import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

export function useWishlist() {
  const { token } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/wishlist/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to fetch wishlist");

      return data.wishlist;
    },
  });

  return { wishlist: data, isLoading, error };
}
