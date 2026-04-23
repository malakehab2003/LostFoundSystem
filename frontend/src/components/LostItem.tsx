import { Link, useParams } from "react-router-dom";
import { useGetItem } from "@/features/items/hooks/useGetItem";
import { useState } from "react";
import { ArrowLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const itemImages = [
  "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1575908539614-ff89490f4a78?q=80&w=733&auto=format&fit=crop",
];

const LostItem = () => {
  const { itemId } = useParams();
  const { item, isLoading } = useGetItem(Number(itemId));

  const [currentImage, setCurrentImage] = useState(0);

  const images = item?.images || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

      
      <Link to={'/dashboard'}  className="bg-white border-b px-6 py-4 flex items-center gap-4">
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
                <img src={img} className="w-full h-full object-cover" />
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

          {/* LOCATION DETAILS (NEW) */}
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
    </div>
  );
};

export default LostItem;
