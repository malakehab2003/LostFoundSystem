import React from "react";
import {
  Plus,
  MessageSquare,
  User,
  Bell,
  ChevronRight,
  AlertCircle,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const Dashboard = () => {
  // Mock data for user's reported items
  const reportedItems = [
    {
      id: 1,
      name: "Black Leather Wallet",
      status: "lost",
      image:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=150&q=80",
      needsPhotos: true,
    },
    {
      id: 1,
      name: "Black Leather Wallet",
      status: "lost",
      image:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=150&q=80",
      needsPhotos: true,
    },
  ];
  return (
    <div className="max-w-6xl mx-auto min-h-screen bg-white text-slate-800 p-6 md:8">
      {/* Dashboard Header */}
      <h1 className="text-5xl font-bold text-[#002D5B] mb-10 tracking-wide">
        Dashboard
      </h1>

      <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Your Items */}
        <div className="lg:col-span-7">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-[#002D5B]">
              Your Items
            </h2>
            <Button
              className="group duration-200 border-2 rounded-full border-primary text-primary hover:text-white hover:bg-primary px-5 py-3 flex items-center gap-3"
              size={"lg"}
              variant={"outline"}
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 text-primary group-hover:text-white" />
              Add an Item
            </Button>
          </div>

          <div className="space-y-6 divide-y-2 divide-slate-200">
            {reportedItems.map((item) => (
              <div key={item.id} className="group pb-8 cursor-pointer">
                <div className="flex items-center gap-6">
                  {/* Item Thumbnail */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-slate-700 group-hover:text-slate-800 transition-colors">
                        {item.name}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>

                    {item.needsPhotos && (
                      <div className="flex items-center gap-1 mt-2 text-slate-500">
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-sm font-medium">
                          Add photos to{" "}
                          <span className="font-bold italic">lost</span> report
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Inbox & Settings */}
        <div className="lg:col-span-5 space-y-8">
          {/* Inbox Section */}
          <section>
            <h2 className="text-2xl font-semibold text-[#002D5B] mb-6">
              Inbox
            </h2>
            <Link
              to="/dashboard/messages"
              className="group w-full flex items-center justify-between gap-1 border border-slate-200 py-2 px-4 rounded-xl hover:bg-slate-50 transition-all"
            >
              <div className="p-2 rounded-xl">
                <MessageSquare className="w-5 h-5 text-slate-600 group-hover:text-primary" />
              </div>
              <span className="text-base font-semibold text-slate-600 group-hover:text-primary">
                Messages
              </span>
              <span className="ml-auto bg-primary text-white text-xs font-black px-2 py-1 rounded-full">
                2
              </span>
            </Link>
          </section>

          {/* Account Settings Section */}
          <section>
            <h2 className="text-2xl font-semibold text-[#002D5B] mb-6">
              Account Settings
            </h2>
            <Link
              to="/dashboard/info"
              className="group w-full flex items-center gap-1 border border-slate-200 py-2 px-4 rounded-xl hover:bg-slate-50 transition-all"
            >
              <div className="p-2 rounded-xl">
                <User className="w-5 h-5 text-slate-600 group-hover:text-primary" />
              </div>
              <span className="text-base font-semibold text-slate-600 group-hover:text-primary">
                Personal information
              </span>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
