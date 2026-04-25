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

    setIsLoading(true);
    setError(null);

    try {
      const STORAGE_KEY = `comments_item_${itemId}`;
      const savedComments = localStorage.getItem(STORAGE_KEY);
      
      if (savedComments) {
        setComments(JSON.parse(savedComments));
        console.log(`✅ Comments loaded from localStorage for item ${itemId}`);
      } else {
        // بيانات افتراضية للعرض الأول
        const defaultComments: Comment[] = [
          {
            id: 1,
            content: "Checked the local transit office today, no luck yet but they have my contact info.",
            item_id: itemId,
            user_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user: { id: 1, name: "Haitham B." }
          },
          {
            id: 2,
            content: "I called the police station, they said they'll check the cameras.",
            item_id: itemId,
            user_id: 2,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            user: { id: 2, name: "Ahmed M." }
          },
          {
            id: 3,
            content: "Found someone who saw something! Waiting for more info.",
            item_id: itemId,
            user_id: 3,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 172800000).toISOString(),
            user: { id: 3, name: "Sara A." }
          }
        ];
        setComments(defaultComments);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultComments));
        console.log(`✅ Default comments saved for item ${itemId}`);
      }
    } catch (err: any) {
      console.error("Error loading comments:", err.message);
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