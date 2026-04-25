import { Link, useParams } from "react-router-dom";
import { useGetItem } from "@/features/items/hooks/useGetItem";
import { useState } from "react";
import { ArrowLeft, ChevronRight, Info, Send, Clock, Megaphone, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/AuthContext";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import toast from "react-hot-toast";

// ✅ Comments hooks
import { useFetchComments } from "@/features/comments/hooks/useFetchComments";
import { useAddComment } from "@/features/comments/hooks/useAddComment";
import { useDeleteComment } from "@/features/comments/hooks/useDeleteComment";
import { useUpdateComment } from "@/features/comments/hooks/useUpdateComment";

const itemImages = [
  "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1575908539614-ff89490f4a78?q=80&w=733&auto=format&fit=crop",
];

const LostItem = () => {
  const { itemId } = useParams();
  const { item, isLoading } = useGetItem(Number(itemId));
  const { user } = useAuth();
  const { user: currentUser } = useCurrentUser();

  const [currentImage, setCurrentImage] = useState(0);

  // ================= COMMENTS =================
  const {
    comments,
    isLoading: commentsLoading,
    refetch,
  } = useFetchComments(Number(itemId));

  const { addComment, isLoading: isAdding } = useAddComment();
  const { deleteComment, isLoading: isDeleting } = useDeleteComment();
  const { updateComment, isLoading: isUpdating } = useUpdateComment();

  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const images = item?.images || [];

  // ================= ADD COMMENT =================
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    const success = await addComment(newComment, Number(itemId));
    if (success) {
      setNewComment("");
      refetch();
      toast.success("Comment added successfully! 🎉");
    }
  };

  // ================= DELETE COMMENT =================
  const handleDeleteComment = async (id: number) => {
    const success = await deleteComment(id, Number(itemId));
    if (success) {
      refetch();
    }
  };

  // ================= EDIT COMMENT =================
  const handleEditComment = async (id: number) => {
    const success = await updateComment(id, editText, Number(itemId));
    if (success) {
      setEditingId(null);
      refetch();
      toast.success("Comment updated successfully! ✏️");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      <Link to={'/dashboard'} className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold">Back to Results</span>
      </Link>

      <main className="max-w-6xl mx-auto w-full p-6 md:p-10 flex flex-col md:flex-row gap-12 bg-white mt-6 rounded-3xl shadow-sm">

        {/* LEFT */}
        <div className="flex-1 space-y-4">

          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100">
            <img
              src={images[currentImage] || itemImages[currentImage]}
              className="w-full h-full object-cover"
              alt={item?.title}
            />

            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* thumbnails */}
          <div className="flex gap-3 justify-center">
            {(images.length ? images : itemImages).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${
                  currentImage === idx ? "border-violet-600" : ""
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`thumbnail ${idx}`} />
              </button>
            ))}
          </div>

          <div className="text-center text-xs text-slate-400">
            Item reported by system
          </div>

          <div className="pt-4 text-center">
            <Button size="lg" className="rounded-full">
              Reclaim Item
            </Button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 space-y-8">

          <h1 className="text-3xl font-bold">
            {item?.title}
          </h1>

          {/* TYPE + DATE */}
          <div className="flex gap-4">
            <div className="bg-violet-500/10 px-6 py-3 rounded-2xl">
              <span className="text-violet-500 font-bold uppercase">
                {item?.type}
              </span>
            </div>

            <div className="bg-violet-500/10 px-6 py-3 rounded-2xl">
              <span className="text-violet-500 font-bold">
                {item?.date}
              </span>
            </div>
          </div>

          {/* LOCATION DETAILS */}
          <div className="space-y-3">

            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-500">City</span>
              <span className="font-bold text-slate-700">
                {item?.city?.name || "Cairo"}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-500">Government</span>
              <span className="font-bold text-slate-700">
                {item?.government?.name || "Cairo Governorate"}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-500">Place</span>
              <span className="font-bold text-slate-700">
                {item?.place?.name || item?.location || "Unknown Location"}
              </span>
            </div>

          </div>

          {/* ABOUT */}
          <section className="space-y-4">
            <h2 className="text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4" />
              About This Item
            </h2>

            <div className="text-slate-700">
              {item?.description}
            </div>
          </section>

        </div>
      </main>

      {/* ================= COMMENTS SECTION ================= */}
      <div className="max-w-6xl mx-auto w-full p-6 md:p-10 bg-white mt-6 rounded-3xl shadow-sm">
        
        {/* Comments Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-violet-100 rounded-full">
            <Megaphone className="w-5 h-5 text-violet-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Comments ({comments?.length || 0})
          </h2>
        </div>

        <p className="text-slate-500 text-sm mb-6">
          Share your thoughts or ask about this item.
        </p>

        {/* Comments List */}
        <div className="space-y-4 mb-8">
          {commentsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
            </div>
          ) : comments?.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments?.map((comment) => {
              const isOwner = comment.user_id === currentUser?.id;
              
              return (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-violet-600 font-bold">
                      {comment.user?.name?.charAt(0) || "U"}
                    </span>
                  </div>

                  <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3 relative group">
                    
                    {/* Actions - ظاهرة للكل */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditText(comment.content);
                        }}
                        className="p-1.5 rounded-full hover:bg-gray-200 text-slate-500 hover:text-violet-600 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-1.5 rounded-full hover:bg-gray-200 text-slate-500 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="font-semibold text-slate-800 mb-1 pr-16">
                      {comment.user?.name || "User"}
                    </h3>

                    {editingId === comment.id ? (
                      <div>
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="min-h-[80px] text-sm"
                        />
                        <div className="flex gap-2 mt-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleEditComment(comment.id)}
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
                        <p className="text-slate-600 text-sm mb-2 pr-16">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
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
        <div className="flex gap-4 border-t pt-6">
          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
            <span className="text-violet-600 font-bold">
              {currentUser?.name?.charAt(0) || user?.name?.charAt(0) || "U"}
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
                  handleAddComment();
                }
              }}
              disabled={isAdding}
              className="resize-none pr-12"
            />

            <button
              onClick={handleAddComment}
              disabled={isAdding}
              className="absolute bottom-2 right-2 p-2 rounded-full bg-violet-100 text-violet-600 hover:bg-violet-200 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostItem;