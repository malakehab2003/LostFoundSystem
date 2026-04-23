import { useState, useEffect } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

interface Comment {
  id: number;
  content: string;
  item_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
  };
}

export const useFetchComments = (itemId: number | undefined) => {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    if (!itemId) return;

    console.log("🔵 useFetchComments - Fetching comments for item:", itemId);

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/comment/item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📥 Response status:", res.status);
      const data = await res.json();
      console.log("📥 Response data:", data);

      if (res.ok) {
        setComments(data.comments || []);
        console.log("✅ Comments loaded:", data.comments?.length || 0);
      } else {
        console.log("🔴 API failed:", data);
        setError(data.err || data.message || "Failed to fetch comments");
      }
    } catch (err: any) {
      console.error("🔴 Error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [itemId]);

  return {
    comments,
    isLoading: isLoading || isUserLoading,
    error,
    refetch: fetchComments,
  };
};