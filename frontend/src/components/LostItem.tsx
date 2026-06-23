import { Link, useParams } from "react-router-dom";
import { useGetItem } from "@/features/items/hooks/useGetItem";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar,
  Pin,
  User,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "./ui/spinner";
import ItemComments from "./ItemComments";
import defaultpage from "@/assets/default-item-image.svg";
import foundImage from "@/assets/Gemini_Generated_Image_e5u67ze5u67ze5u6.png";

const LostItem = () => {
  const { itemId } = useParams();
  const { item, isLoading } = useGetItem(Number(itemId));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = item?.image || [];
  const displayImages: string[] =
    images.length > 0
      ? (images
          .map((img) => (typeof img === "string" ? img : img.url))
          .filter(Boolean) as string[])
      : [defaultpage];

  const currentImage = displayImages[currentImageIndex];

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1,
    );
  };

  // Open location in Google Maps
  const openInGoogleMaps = () => {
    if (item?.latitude && item?.longitude) {
      window.open(
        `https://www.google.com/maps?q=${item.latitude},${item.longitude}`,
        "_blank"
      );
    }
  };

  return (
    <div className="min-h-screen">
      {isLoading && (
        <div className="text-center py-20 justify-center items-center">
          <Spinner className="w-8 h-8 place-self-center text-primary" />
        </div>
      )}

      {!isLoading && item && (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* LEFT SIDE - Images */}
              <div className="space-y-4 order-2 md:order-1">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-foreground/5 border border-foreground/10">
                  {item.type === "lost" ? (
                    <img
                      src={currentImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white">
                      <img
                        src={foundImage}
                        alt="Found Item"
                        className="w-full h-full object-contain opacity-80"
                      />
                    </div>
                  )}

                  {displayImages.length > 1 && item.type === "lost" && (
                    <>
                      <button
                        onClick={handlePreviousImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full transition-all shadow-sm"
                      >
                        <ChevronLeft className="w-6 h-6 text-foreground" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full transition-all shadow-sm"
                      >
                        <ChevronRight className="w-6 h-6 text-foreground" />
                      </button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {currentImageIndex + 1} / {displayImages.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails - only for lost items */}
                {displayImages.length > 1 && item.type === "lost" && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {displayImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                          currentImageIndex === idx
                            ? "border-primary ring-2 ring-primary/50"
                            : "border-foreground/10 hover:border-foreground/20"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT SIDE - Item Details */}
              <div className="space-y-5 order-1 md:order-2">
                <div className="space-y-2 flex justify-between items-center gap-4">
                  <h1 className="text-3xl font-semibold text-foreground-900">
                    {item.title}
                  </h1>
                  <Badge
                    variant={item.type === "lost" ? "destructive" : "default"}
                    className="text-sm capitalize"
                  >
                    {item.type}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-foreground-500 uppercase">
                        {item.type} Date
                      </span>
                    </div>
                    <p className="font-semibold text-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-primary/5 overflow-hidden rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Pin className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-foreground-500 uppercase">
                        Location
                      </span>
                    </div>
                    <p className="font-semibold text-foreground">
                      {item.place}
                    </p>
                  </div>
                </div>

                {/*  View Location - only for found items */}
                {item.type === "found" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    {item.latitude && item.longitude ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              Location Found
                            </p>
                            <p className="text-xs text-green-600">
                              {item.latitude}, {item.longitude}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-700 hover:bg-green-100"
                          onClick={openInGoogleMaps}
                        >
                          View on Map
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            No Location Added
                          </p>
                          <p className="text-xs text-gray-400">
                            This found item does not have a location.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2 border-t pt-4">
                  <h2 className="text-lg font-semibold text-foreground-700 flex items-center gap-2 capitalize">
                    <Info className="w-5 h-5 text-primary" />
                    About this item
                  </h2>

                  <div className="space-y-3">
                    <div className="flex items-start justify-between py-3 border-b border-foreground/5">
                      <span className="text-foreground-600">City</span>
                      <span className="font-semibold text-foreground-800">
                        {item.city?.name || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between py-3 border-b border-foreground/5">
                      <span className="text-foreground-600">Government</span>
                      <span className="font-semibold text-foreground-800">
                        {item.government?.name || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between py-3 border-b border-foreground/5">
                      <span className="text-foreground-600">Category</span>
                      <span className="font-semibold text-foreground-800">
                        {item.category?.name || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {item.description && (
                  <div className="py-3">
                    <h2 className="font-semibold text-foreground-800 mb-2 text-xl">
                      Notes
                    </h2>
                    <p className="text-foreground-600 leading-relaxed text-lg">
                      {item.description}
                    </p>
                  </div>
                )}

                <Button size="lg" className="w-full" asChild>
                  <Link to={`/profile/${item.user?.id}`}>
                    <User className="w-5 h-5 mr-2" />
                    View {item.user?.name || "User"}'s Profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="">
            <ItemComments itemId={Number(itemId)} />
          </div>
        </>
      )}
    </div>
  );
};

export default LostItem;