import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

interface User {
  id: number;
  name: string;
  email: string;
  image_url?: string;
  phone?: string;
}

interface GetAnotherUserParams {
  email?: string;
  id?: number;
}

export function useGetAnotherUser({ email, id }: GetAnotherUserParams) {
  const { token } = useAuth();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery<User>({
    queryKey: ["another-user", email, id],

    queryFn: async () => {
      const params = new URLSearchParams();

      if (email) params.append("email", email);
      if (id) params.append("id", String(id));

      const res = await fetch(
        `http://localhost:5000/api/user/getUser?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.err || "Failed to fetch user");
      }

      return data.user;
    },

    enabled: !!token && (!!email || !!id),
  });

  return {
    user,
    isLoading,
    error,
    refetch,
  };
}
