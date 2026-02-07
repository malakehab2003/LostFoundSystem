import { useState } from "react";
import { MapPin, Calendar, Filter, List, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { category, government, cities } from "@/lib/constants";
import { DatePicker } from "@/components/DatePicker";
const foundItems = [
  {
    id: 1,
    title: "Black Leather Wallet",
    location: "Downtown Central",
    date: "Jan 14, 2026",
    img: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Silver Keychain",
    location: "North Park Area",
    date: "Jan 12, 2026",
    img: "https://images.unsplash.com/photo-1575908539614-ff89490f4a78?q=80&w=733&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Blue Smartphone",
    location: "Metro Station",
    date: "Jan 13, 2026",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
  },
];

const sidebarFitlers = [
  {
    name: "Category",
    icon: List,
    value: "Wallet",
  },
  {
    name: "Government",
    icon: Landmark,
    value: "Cairo",
  },
  {
    name: "City",
    icon: MapPin,
    value: "Nasr City",
  },
];

const LostItems = () => {
  const [activeTab, setActiveTab] = useState("photo");

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* Header Section */}
      <div className="pt-10 pb-6 text-center px-4">
        <h1 className="text-4xl font-bold text-violet-900 text-center mb-4">
          Items sorted by best photo match
        </h1>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab("photo")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === "photo"
                ? "bg-violet-500/20 text-violet-500 ring-1 ring-violet-500"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            Photo Matches
          </button>
          <button
            onClick={() => setActiveTab("nearby")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
              activeTab === "nearby"
                ? "bg-violet-500/20 text-violet-500 ring-1 ring-violet-500"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> Nearby Matches
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4" /> Filter
            </h2>
            <button className="text-xs text-slate-400 hover:text-slate-600 underline">
              Reset Filters
            </button>
          </div>

          <div className="space-y-6">
            {sidebarFitlers.map((filter) => (
              <div
                className="flex flex-col gap-4 border-b pb-4"
                key={filter.name}
              >
                <span className="text-slate-700 flex font-medium items-center justify-between gap-1 text-sm">
                  {filter.name}{" "}
                  <filter.icon className="w-3.5 h-3.5 text-slate-400" />
                </span>
                <Select>
                  <SelectTrigger className="w-full px-3 py-3 border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400">
                    <SelectValue placeholder={filter.value} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.name === "Category" &&
                      category.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    {filter.name === "Government" &&
                      government.map((gov) => (
                        <SelectItem key={gov} value={gov}>
                          {gov}
                        </SelectItem>
                      ))}
                    {filter.name === "City" &&
                      cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            {/* Date Picker Filter */}
            <div className="flex flex-col gap-4 border-b pb-4">
              <span className="text-slate-700 flex font-medium items-center justify-between gap-1 text-sm">
                Date <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </span>
              <DatePicker />
            </div>

            <Button
              size={"lg"}
              variant={"default"}
              className="w-full align-center self-center mx-auto"
            >
              Apply Filters
            </Button>
          </div>
        </aside>

        {/* Results Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {foundItems.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100 mb-3 border border-gray-100">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Info Section */}
                <div className="space-y-1">
                  <h3 className="font-bold text-[#002D5B] group-hover:text-violet-500 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Found in: {item.location}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Reported on {item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LostItems;
