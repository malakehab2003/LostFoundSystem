import { Trash2, Eye, Send, Clock, Megaphone } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "react-router-dom";
import { useGetItem } from "@/features/items/hooks/useGetItem";
import defaultpage from "@/assets/default-profile.webp";
import { Spinner } from "./ui/spinner";

const DashItem = () => {
  const { itemId } = useParams();
  const { item, isLoading } = useGetItem(Number(itemId));
  console.log(item);
  const updates = [
    {
      id: 1,
      userInitials: "HB",
      userName: "Haitham B.",
      message:
        "Checked the local transit office today, no luck yet but they have my contact info.",
      timestamp: "Today at 3:06 PM",
    },
  ];
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <div className="rounded-xl px-5 py-6 shadow-lg">
        {isLoading ? (
          <div className="text-center justify-center items-center">
            <Spinner className="w-8 h-8 place-self-center text-primary" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-5">
            {/* Item Image */}
            <div className="w-36 h-36 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
              <img
                src={item?.images?.[0] || defaultpage}
                alt={item?.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Item Info & Main Actions */}
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
                <Button
                  className="cursor-pointer bg-red-500/40 hover:bg-red-500 text-white p-2 rounded-full flex items-center justify-center"
                  size={"icon-sm"}
                  variant={"destructive"}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

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

      {/* Comment section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Megaphone className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-blue-950 tracking-wide">
            Updates
          </h1>
        </div>
        <p className="text-slate-700 text-sm mb-6">
          Keep others informed about your search progress by posting updates.
        </p>
      </div>

      {/* Updates Feed */}
      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">
                {update.userInitials}
              </span>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-2">
                {update.userName}
              </h3>
              <p className="text-slate-700 mb-2 text-sm">{update.message}</p>
              <div className="flex items-center font-semibold gap-1 text-slate-500 text-xs tracking-wide italic">
                <Clock className="w-3 h-3" />
                {update.timestamp}
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-4 mt-10 border-t pt-10">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold">HB</span>
          </div>

          <div className="flex-1 relative">
            <Textarea placeholder="Post an update..." />
            <button className=" cursor-pointer absolute bottom-1 right-1 p-2 bg-primary/10 text-primary/80 rounded-full hover:bg-primary/40 duration-200">
              <Send className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashItem;
