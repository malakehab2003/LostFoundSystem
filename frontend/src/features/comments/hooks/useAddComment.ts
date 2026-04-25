import { useState } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import toast from "react-hot-toast";

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
      toast.error("Comment cannot be empty");
      setError("Comment cannot be empty");
      return false;
    }

    if (!user?.id) {
      console.log("🔴 No user ID found!");
      toast.error("You must be logged in to comment");
      setError("You must be logged in to comment");
      return false;
    }

    setIsLoading(true);
    setError(null);

    // ✅ تخزين في localStorage أولاً (للتحديث الفوري)
    try {
      const STORAGE_KEY = `comments_item_${itemId}`;
      const savedComments = localStorage.getItem(STORAGE_KEY);
      let existingComments = savedComments ? JSON.parse(savedComments) : [];
      
      const newComment = {
        id: Date.now(),
        content: content,
        item_id: itemId,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: { 
          id: user.id, 
          name: user.name || user.userName || "Current User"
        }
      };
      
      existingComments = [newComment, ...existingComments];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingComments));
      console.log("✅ Comment saved to localStorage");
    } catch (err: any) {
      console.error("Error saving to localStorage:", err.message);
    }

    // ✅ محاولة إرسال للـ API
    const requestBody = {
      content,
      itemId: itemId,
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
        console.log("✅ Comment added successfully to API!");
        toast.success("Comment added successfully! 🎉");
        return true;
      } else {
        console.log("🔴 API failed:", data);
        toast.error(data.err || data.message || "Failed to add comment to server, but saved locally");
        setError(data.err || data.message || "Failed to add comment");
        return true; // ✅ return true because it's saved in localStorage
      }
    } catch (err: any) {
      console.error("🔴 Error:", err.message);
      toast.error("Comment saved locally only");
      setError(err.message);
      return true; // ✅ return true because it's saved in localStorage
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