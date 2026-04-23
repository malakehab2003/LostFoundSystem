import {
  Trash2,
  Eye,
  Send,
  Clock,
  Megaphone,
  Edit,
  X,
  AlertCircle,
} from "lucide-react";

import { Button } from "../ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetItem } from "@/features/items/hooks/useGetItem";
import defaultpage from "@/assets/default-profile.webp";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";

// ✅ hooks
import { useFetchComments } from "@/features/comments/hooks/useFetchComments";
import { useAddComment } from "@/features/comments/hooks/useAddComment";
import { useDeleteComment } from "@/features/comments/hooks/useDeleteComment";
import { useUpdateComment } from "@/features/comments/hooks/useUpdateComment";
import { useDeleteItem } from "@/features/items/hooks/useDeleteItem"; // ✅ استورد useDeleteItem

const DashItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const isAdmin = user?.role == "admin";

  const { item, isLoading: itemLoading } = useGetItem(Number(itemId));

  // ✅ useDeleteItem hook
  const { deleteItem, isPending: isDeletingItem } = useDeleteItem();

  // ================= COMMENTS FROM API =================
  const {
    comments: apiComments,
    isLoading: commentsLoading,
    usingFakeData,
    refetch,
  } = useFetchComments(Number(itemId));

  // ================= LOCAL STATE =================
  const [localComments, setLocalComments] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // ================= SYNC API COMMENTS TO LOCAL =================
  useEffect(() => {
    if (apiComments && apiComments.length > 0 && !isInitialized) {
      setLocalComments(apiComments);
      setIsInitialized(true);
    } else if (apiComments && apiComments.length > 0 && isInitialized) {
      setLocalComments(apiComments);
    }
  }, [apiComments]);

  const { addComment, isLoading: isAdding } = useAddComment();
  const { deleteComment, isLoading: isDeleting } = useDeleteComment();
  const { updateComment, isLoading: isUpdating } = useUpdateComment();

  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // ================= ITEM DELETE (using hook) =================
  const handleDeleteItem = () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    deleteItem(Number(itemId), {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  };

  // ================= ADD COMMENT =================
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const tempId = Date.now();
    const newCommentObj = {
      id: tempId,
      content: newComment,
      item_id: Number(itemId),
      user_id: user?.id || 1,
      created_at: new Date().toISOString(),
      user: { id: user?.id || 1, name: user?.name || "Current User" }
    };
    
    setLocalComments([newCommentObj, ...localComments]);
    setNewComment("");

    const success = await addComment(newComment, Number(itemId));
    if (success) {
      refetch();
    }
  };

  // ================= DELETE COMMENT =================
  const handleDeleteComment = async (id: number) => {
    if (!confirm("Delete this comment?")) return;

    setLocalComments(localComments.filter(comment => comment.id !== id));

    const success = await deleteComment(id);
    if (success) {
      refetch();
    }
  };

  // ================= EDIT COMMENT =================
  const handleEditComment = async (id: number) => {
    if (!editText.trim()) return;

    setLocalComments(localComments.map(comment => 
      comment.id === id 
        ? { ...comment, content: editText }
        : comment
    ));
    setEditingId(null);

    const success = await updateComment(id, editText);
    if (success) {
      refetch();
    }
  };

  const displayComments = localComments.length > 0 ? localComments : apiComments;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <div className="rounded-xl px-5 py-6 shadow-lg">
        {itemLoading ? (
          <div className="text-center justify-center items-center">
            <Spinner className="w-8 h-8 place-self-center text-primary" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-5">
            <div className="w-36 h-36 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
              <img
                src={item?.images?.[0] || defaultpage}
                alt={item?.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-4 w-full text-center md:text-left">
              <div className="pb-4 flex justify-between gap-5 items-start">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground/90 mb-2">
                    {item?.title}
                  </h1>
                  <p className="text-foreground/80 text-sm tracking-wide place-self-start">
                    Reported {item?.type}: {item?.date}
                  </p>
                </div>

                {!isAdmin && (
                  <Button
                    onClick={handleDeleteItem}
                    disabled={isDeletingItem}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full disabled:opacity-50"
                    size={"icon-sm"}
                    variant={"destructive"}
                  >
                    {isDeletingItem ? (
                      <Spinner className="w-4 h-4" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>

              <Link to={`/lost/${itemId}`}>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Button
                    variant={"default"}
                    size={"lg"}
                    className="flex-1 flex items-center gap-2 cursor-pointer px-4 py-2 rounded-2xl"
                  >
                    <Eye className="w-4 h-4" /> Search
                  </Button>

                  <Link to={"info"}>
                    <Button
                      variant={"outline"}
                      size={"lg"}
                      className="cursor-pointer flex items-center px-4 py-2 text-slate-800 hover:text-white hover:bg-primary transition-all duration-300 rounded-2xl"
                    >
                      Edit Item Details
                    </Button>
                  </Link>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Comment section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Megaphone className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-blue-950 tracking-wide">
            Updates ({displayComments?.length || 0})
          </h1>
        </div>

        <p className="text-slate-700 text-sm mb-6">
          Keep others informed about your search progress by posting updates.
        </p>

        {usingFakeData && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>⚠️ API connection failed. Showing demo data. Check console for errors.</span>
          </div>
        )}
      </div>

      {/* Updates Feed */}
      <div className="space-y-4">
        {commentsLoading ? (
          <Spinner className="w-6 h-6" />
        ) : (
          displayComments?.map((update) => {
            return (
              <div key={update.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">
                    {update.user?.name?.charAt(0) || "U"}
                  </span>
                </div>

                <div className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm relative">

                  {/* Actions - ظاهرة للكل */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(update.id);
                        setEditText(update.content);
                      }}
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-primary transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteComment(update.id)}
                      className="p-1.5 rounded-full hover:bg-red-100 text-slate-500 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-slate-800 mb-2 pr-16">
                    {update.user?.name || "User"}
                  </h3>

                  {editingId === update.id ? (
                    <div>
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="flex gap-2 mt-2">
                        <Button onClick={() => handleEditComment(update.id)} disabled={isUpdating}>
                          {isUpdating ? "Saving..." : "Save"}
                        </Button>
                        <Button variant="outline" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-700 mb-2 text-sm pr-16">
                      {update.content}
                    </p>
                  )}

                  <div className="flex items-center font-semibold gap-1 text-slate-500 text-xs tracking-wide italic">
                    <Clock className="w-3 h-3" />
                    {new Date(update.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Add Comment */}
        <div className="flex gap-4 mt-10 border-t pt-10">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold">
              {user?.name?.charAt(0) || "U"}
            </span>
          </div>

          <div className="flex-1 relative">
            <Textarea
              placeholder="Post an update..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              disabled={isAdding}
            />

            <button
              onClick={handleAddComment}
              disabled={isAdding}
              className="cursor-pointer absolute bottom-1 right-1 p-2 bg-primary/10 text-primary/80 rounded-full hover:bg-primary/40 duration-200 disabled:opacity-50"
            >
              <Send className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashItem;