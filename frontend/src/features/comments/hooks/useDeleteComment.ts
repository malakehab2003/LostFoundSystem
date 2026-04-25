import { useState } from "react";
import toast from "react-hot-toast";

export const useDeleteComment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteComment = async (id: number, itemId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const STORAGE_KEY = `comments_item_${itemId}`;
      const savedComments = localStorage.getItem(STORAGE_KEY);
      
      if (savedComments) {
        let existingComments = JSON.parse(savedComments);
        const newComments = existingComments.filter((comment: any) => comment.id !== id);
        
        if (newComments.length === existingComments.length) {
          toast.error("Comment not found");
          return false;
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newComments));
        console.log(`✅ Comment deleted for item ${itemId}:`, { id });
        toast.success("Comment deleted successfully! 🗑️");
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Error deleting comment:", err.message);
      toast.error(err.message);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteComment, isLoading, error };
};