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
import defaultpage from "@/assets/default-item-image.svg";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useGetComments } from "@/features/comments/hooks/useGetComments";
import { useAddComment } from "@/features/comments/hooks/useAddComment";
import { useDeleteComment } from "@/features/comments/hooks/useDeleteComment";
import { useUpdateComment } from "@/features/comments/hooks/useUpdateComment";
import { useDeleteItem } from "@/features/items/hooks/useDeleteItem";
import ItemComments from "../ItemComments";
import DeleteItemDialog from "../dialog/DeleteItemDialog";

const DashItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { item, isLoading } = useGetItem(Number(itemId));
  console.log(item);
  const handleSearch = () => {
    if (!item) return;

    const params = new URLSearchParams();

    if (item.title) params.append("title", item.title);
    if (item.place) params.append("place", item.place);
    if (item.type)
      params.append("type", item.type === "lost" ? "found" : "lsot");
    if (item.item_category_id)
      params.append("category_id", String(item.item_category_id));
    if (item.government_id)
      params.append("government_id", String(item.government_id));
    if (item.city_id) params.append("city_id", String(item.city_id));
    if (item.date) params.append("date", new Date(item.date).toISOString());

    navigate(`/items?${params.toString()}`);
  };
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <div className="rounded-xl px-5 py-6 shadow-lg">
        {isLoading ? (
          <div className="text-center justify-center items-center">
            <Spinner className="w-8 h-8 place-self-center text-primary" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-5">
            <div className="w-36 h-36 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
              <img
                src={item?.image?.[0]?.url || defaultpage}
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
                <DeleteItemDialog itemId={Number(itemId)} />
              </div>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button
                  onClick={handleSearch}
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
                    className="cursor-pointer flex items-center px-4 py-2  text-slate-800 hover:text-white hover:bg-primary transition-all duration-300 rounded-2xl"
                  >
                    Edit Item Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="">
        <ItemComments itemId={Number(itemId)} />
      </div>
    </div>
  );
};

export default DashItem;
