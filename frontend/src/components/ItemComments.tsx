import { useState } from "react";
import { Megaphone, Edit, Trash2, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useAddComment } from "@/features/comments/hooks/useAddComment";
import { useDeleteComment } from "@/features/comments/hooks/useDeleteComment";
import { Spinner } from "./ui/spinner";
import { useGetComments } from "@/features/comments/hooks/useGetComments";
import { useUpdateComment } from "@/features/comments/hooks/useUpdateComment";

interface ItemCommentsProps {
  itemId: number;
}

const ItemComments = ({ itemId }: ItemCommentsProps) => {
  const { user: currentUser } = useCurrentUser();
  const { comments, isLoading: commentsLoading } = useGetComments(itemId);
  console.log(comments);
  const { addComment, isPending: isAdding } = useAddComment();
  const { deleteComment } = useDeleteComment();
  const { updateComment, isPending: isUpdating } = useUpdateComment();

  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <div className="space-y-4 border-t-2 border-foreground/10 py-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Megaphone className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-blue-950 tracking-wide">
            Comments {comments ? `(${comments.length})` : ""}
          </h1>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-3">
          {commentsLoading ? (
            <div className="text-center py-8 justify-center items-center">
              <Spinner className="w-8 h-8 place-self-center text-primary" />
            </div>
          ) : comments?.length === 0 ? (
            <div className="text-center py-8 text-foreground-400">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments?.map((comment) => {
              const isOwner = comment.user_id === currentUser?.id;

              return (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">
                      {comment.user?.name?.charAt(0) || "U"}
                    </span>
                  </div>

                  <div className="flex-1 bg-primary/5 rounded-lg px-3 py-2 relative group">
                    {isOwner && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => {
                            setEditingId(comment.id);
                            setEditText(comment.content);
                          }}
                          className="p-1.5 rounded-full hover:bg-primary/10 text-foreground-500 hover:text-primary transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            deleteComment({ commentId: comment.id })
                          }
                          className="p-1.5 rounded-full hover:bg-primary/10 text-foreground-500 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <h3 className="font-semibold text-foreground-800 mb-2 pr-8">
                      {comment.user?.name || "User"}
                    </h3>

                    {editingId === comment.id ? (
                      <div>
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="min-h-20 text-sm"
                        />
                        <div className="flex gap-3 mt-3">
                          <Button
                            size="sm"
                            onClick={() =>
                              updateComment({
                                commentId: comment.id,
                                content: editText,
                              })
                            }
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-foreground-600 text-sm mb-3 pr-8">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-1 text-foreground-500 text-xs">
                          <Clock className="w-3 h-3" />
                          {new Date(comment.created_at).toLocaleString()}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Comment */}
        <div className="pt-6 flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-sm">
              {currentUser?.name?.charAt(0) || "U"}
            </span>
          </div>

          <div className="flex-1 relative">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  addComment({ itemId, content: newComment });
                  setNewComment("");
                }
              }}
              disabled={isAdding}
              className="resize-none pr-8 min-h-24"
            />

            <button
              onClick={() => addComment({ itemId, content: newComment })}
              disabled={isAdding}
              className="absolute bottom-2 right-2 p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItemComments;
