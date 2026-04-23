import { useState } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export const useUpdateComment = () => {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateComment = async (id: number, content: string) => {
    if (!content.trim()) {
      setError("Comment cannot be empty");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/comment/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      console.log("📥 Response status:", res.status);
      const data = await res.json();
      console.log("📥 Response data:", data);

      if (res.ok) {
        console.log("✅ Comment updated successfully!");
        return true;
      } else {
        console.log("🔴 API failed:", data);
        setError(data.err || data.message || "Failed to update comment");
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
    updateComment, 
    isLoading: isLoading || isUserLoading, 
    error 
  };
};