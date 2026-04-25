import { useState } from "react";
import toast from "react-hot-toast";

export const useUpdateComment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateComment = async (id: number, content: string, itemId: number) => {
    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      setError("Comment cannot be empty");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const STORAGE_KEY = `comments_item_${itemId}`;
      const savedComments = localStorage.getItem(STORAGE_KEY);
      
      if (savedComments) {
        let existingComments = JSON.parse(savedComments);
        const commentExists = existingComments.some((comment: any) => comment.id === id);
        
        if (!commentExists) {
          toast.error("Comment not found");
          return false;
        }
        
        existingComments = existingComments.map((comment: any) => 
          comment.id === id 
            ? { ...comment, content: content, updated_at: new Date().toISOString() }
            : comment
        );
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingComments));
        console.log(`✅ Comment updated for item ${itemId}:`, { id, content });
        toast.success("Comment updated successfully! ✏️");
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Error updating comment:", err.message);
      toast.error(err.message);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateComment, isLoading, error };
};