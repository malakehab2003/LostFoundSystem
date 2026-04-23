import { useState } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export const useAddComment = () => {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = async (content: string, itemId: number) => {
    console.log("🔵 useAddComment - Starting");
    console.log("   Content:", content);
    console.log("   ItemId:", itemId);
    console.log("   User from useCurrentUser:", user);
    console.log("   User ID:", user?.id);

    if (!content.trim()) {
      setError("Comment cannot be empty");
      return false;
    }

    if (!user?.id) {
      console.log("🔴 No user ID found!");
      setError("You must be logged in to comment");
      return false;
    }

    setIsLoading(true);
    setError(null);

    const requestBody = {
      content,
      item_id: itemId,
      user_id: user.id,
    };
    console.log("📤 Request body:", requestBody);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/comment/addComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📥 Response status:", res.status);
      const data = await res.json();
      console.log("📥 Response data:", data);

      if (res.ok) {
        console.log("✅ Comment added successfully!");
        return true;
      } else {
        console.log("🔴 API failed:", data);
        setError(data.err || data.message || "Failed to add comment");
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
    addComment, 
    isLoading: isLoading || isUserLoading, 
    error 
  };
};