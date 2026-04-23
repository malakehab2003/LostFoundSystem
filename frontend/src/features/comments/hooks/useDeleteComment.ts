import { useState } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export const useDeleteComment = () => {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteComment = async (id: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/comment/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📥 Response status:", res.status);
      const data = await res.json();
      console.log("📥 Response data:", data);

      if (res.ok) {
        console.log("✅ Comment deleted successfully!");
        return true;
      } else {
        console.log("🔴 API failed:", data);
        setError(data.err || data.message || "Failed to delete comment");
        return false;
      }
    } catch (err: any) {
      console.error("🔴 Error:", err.message);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    deleteComment, 
    isLoading: isLoading || isUserLoading, 
    error 
  };
};