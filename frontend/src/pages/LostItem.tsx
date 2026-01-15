import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronRight, Info, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const itemImages = [
  "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1575908539614-ff89490f4a78?q=80&w=733&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const LostItem = () => {
  const { itemId } = useParams();
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-slate-800">Back to Results</span>
      </nav>

      <main className="max-w-6xl mx-auto w-full p-6 md:p-10 flex flex-col md:flex-row gap-12 bg-white mt-6 rounded-3xl shadow-sm overflow-hidden">
        {/* Left: Image Gallery Section */}
        <div className="flex-1 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 group">
            <img
              src={itemImages[currentImage]}
              alt="Found item"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gallery Navigation Arrows */}
            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg text-violet-600 hover:bg-white transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 justify-center">
            {itemImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  currentImage === idx
                    ? "border-violet-600 ring-2 ring-violet-600/20"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  className="w-full h-full object-cover"
                  alt={`view ${idx}`}
                />
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 font-medium pt-2 italic">
            Item reported by Cairo City Police
          </p>

          <div className="pt-4 text-center">
            <Button
              size="lg"
              variant={"default"}
              className="font-bold tracking-wider rounded-full py-4 px-10"
            >
              Reclaim Item
            </Button>
          </div>
        </div>

        {/* Right: Info Section */}
        <div className="flex-1 space-y-8">
          <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Found Item Report
          </h1>

          {/* Quick Status Badges */}
          <div className="flex gap-4">
            <div className="bg-violet-500/10 px-6 py-3 rounded-2xl border border-violet-500/20">
              <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Status
              </span>
              <span className="text-violet-500 font-bold text-lg uppercase tracking-wider">
                FOUND
              </span>
            </div>
            <div className="bg-violet-500/10  px-6 py-3 rounded-2xl border border-violet-500/20">
              <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Found Date
              </span>
              <span className="text-violet-500 font-bold text-lg uppercase">
                01/12/2026
              </span>
            </div>
          </div>

          {/* Detail List */}
          <section className="space-y-6 pt-2">
            <h2 className="text-lg font-bold text-slate-400 tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4" /> About This Item
            </h2>

            <div className="space-y-3">
              {[
                {
                  label: "Category",
                  value: "Wallets & Bags",
                },
                { label: "Reference ID", value: "122631" },
                {
                  label: "Found Near",
                  value: "Downtown Station, NY 10021",
                },
                {
                  label: "Description",
                  value:
                    "Black leather wallet with multiple card slots and a zipper compartment. contact me under the phone number 010-555-1234 to claim it.",
                },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap wrap-break-word justify-between items-center py-3 border-b border-gray-100 group"
                >
                  <span className="text-slate-500 font-medium flex items-center gap-2">
                    {row.label}
                  </span>
                  <span className="text-slate-700 font-bold group-hover:text-violet-400 transition-colors">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Reporter Contact Area */}
          <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-violet-600 font-black text-xl mb-1">
              Central City Transit Police
            </h3>
            <p className="text-slate-400 text-sm">
              Station #04, Recovery Division
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LostItem;
