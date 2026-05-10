// SingleProduct.tsx - نسخة كاملة بدون API منفصل للـ reviews
import { addToCart } from "@/cart/serves/addTocart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useProduct } from "@/features/products/hooks/useProduct";
import { useAddToWishlist } from "@/features/wishlist/hooks/useAddToWishlist";
import { useDeleteFromWishlist } from "@/features/wishlist/hooks/useDeleteFromWishlist";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageSquare, Send, ShoppingCart, StarIcon, Upload, X, Star } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
  const { productId } = useParams();
  const { product, isLoading, error } = useProduct(Number(productId));
  const { wishlist } = useWishlist();
  const { addToWishlist, deleteFromWishlist } = useAddToWishlist();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewRate, setReviewRate] = useState(5);
  const [hoveredRate, setHoveredRate] = useState(0);
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [reviewImagePreview, setReviewImagePreview] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
 const [selectedquantity, setSelectedquantity] = useState("1");
  

  const queryClient = useQueryClient();
  const addCart = useMutation({ mutationFn: addToCart, onSuccess: () => {
    toast.success('Added to cart!');
    queryClient.invalidateQueries({ queryKey: ['get cart'] });
  }, onError: () => toast.error('Failed to add to cart') }).mutate;

  const isInWishlist = wishlist?.some((item: any) => item.product_id === product?.id);
  const handleWishlist = () => {
    if (!product?.id) return;
    isInWishlist ? deleteFromWishlist(product.id) : addToWishlist(product.id);
  };

  // ✅ Get reviews from product
  const reviews = product?.review || [];

  const getSizesArray = () => {
    if (!product?.sizes) return [];
    return Array.isArray(product.sizes) ? product.sizes : product.sizes?.split?.(',').map((s: string) => s.trim()) || [];
  };
  const getColorsArray = () => {
    if (!product?.colors) return [];
    return Array.isArray(product.colors) ? product.colors : product.colors?.split?.(',').map((c: string) => c.trim()) || [];
  };
  const sizesArray = getSizesArray();
  const colorsArray = getColorsArray();

  const getImagesArray = () => {
    if (!product) return [];
    if (product.image && Array.isArray(product.image)) return product.image.map((img: any) => img.url || img.image_url || img);
    if (product.images_url && Array.isArray(product.images_url)) return product.images_url;
    if (product.images && Array.isArray(product.images)) return product.images.map((img: any) => img.url || img);
    return [];
  };
  const imagesArray = getImagesArray();
  
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc: number, r: any) => acc + r.rate, 0) / reviews.length).toFixed(1)
    : product?.rate?.toFixed(1) || "0";

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: async ({ productId, message, rate, image }: { productId: number; message: string; rate: number; image?: File }) => {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("product_id", String(productId));
      formData.append("message", message);
      formData.append("rate", String(rate));
      if (image) formData.append("image", image);
      
      const res = await fetch("http://localhost:5000/api/review/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to create review");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", Number(productId)] });
      toast.success("Review added successfully!");
      setShowReviewModal(false);
      setReviewMessage("");
      setReviewRate(5);
      setReviewImage(null);
      setReviewImagePreview("");
    },
    onError: (err: any) => toast.error(err.message || "Failed to add review"),
  });

  const handleReviewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReviewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setReviewImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReview = () => {
    if (!reviewMessage.trim()) return toast.error("Please write a review");
    createReviewMutation.mutate({
      productId: Number(productId),
      message: reviewMessage,
      rate: reviewRate,
      image: reviewImage || undefined,
    });
  };

  if (error) return (
    <div className="text-center py-20"><p className="text-red-500">Product not found</p>
    <Button onClick={() => window.location.href = '/shop'}>Back to Shop</Button></div>
  );

  return (
    <section className="py-8 bg-gray-50 md:py-16 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          {/* الصور */}
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
            {isLoading ? <Spinner className="w-8 h-8 place-self-center text-primary" /> : (
              imagesArray.length > 1 ? (
                <Carousel className="w-full max-w-sm mx-auto">
                  <CarouselContent>{imagesArray.map((img: any, idx: number) => (
                    <CarouselItem key={idx}><Card><CardContent className="flex aspect-square items-center justify-center p-6">
                      <img src={typeof img === 'string' ? img : img.url || img.image_url} className="w-full h-full object-cover rounded-lg" onError={(e) => (e.target as HTMLImageElement).src = "https://placehold.co/600x600?text=No+Image"} />
                    </CardContent></Card></CarouselItem>
                  ))}</CarouselContent><CarouselPrevious /><CarouselNext />
                </Carousel>
              ) : <img className="w-full rounded-lg object-cover" src={product?.image?.[0]?.url || product?.images_url?.[0] || "https://placehold.co/600x600?text=No+Image"} alt={product?.name} />
            )}
          </div>
          
          {/* معلومات المنتج */}
          <div className="mt-6 sm:mt-8 lg:mt-0">
            <div className="mb-4 flex items-center justify-between gap-4"><h1 className="text-xl font-semibold sm:text-2xl">{product?.name}</h1><Badge variant="outline">{product?.category?.name}</Badge></div>
            <div className="mt-4 sm:flex sm:items-center sm:gap-4"><p className="text-2xl font-semibold sm:text-3xl">${product?.price?.toFixed(2)}</p>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <div className="flex items-center">
  {Array(5).fill(0).map((_, i) => (
    <StarIcon 
      key={i} 
      className={`w-4 h-4 ${
        i < Math.floor(Number(avgRating)) 
          ? "text-yellow-400 fill-yellow-400" 
          : "text-gray-300"
      }`} 
    />
  ))}
</div>
<p className="text-sm font-medium">
  {avgRating} ({reviews?.length || 0} reviews)
</p>

              </div>
            </div>
            <div className="flex items-center gap-4 text-sm my-4">
              {sizesArray.length > 0 && <div className="flex flex-col gap-1"><span>Size</span><Select onValueChange={setSelectedSize} defaultValue={sizesArray[0]}><SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger><SelectContent>{sizesArray.map((size: string) => <SelectItem key={size} value={size}>{size}</SelectItem>)}</SelectContent></Select></div>}
              {colorsArray.length > 0 && <div className="flex flex-col gap-1"><span>Color</span><Select onValueChange={setSelectedColor} defaultValue={colorsArray[0]}><SelectTrigger><SelectValue placeholder="Select color" /></SelectTrigger><SelectContent>{colorsArray.map((color: string) => <SelectItem key={color} value={color}><div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border" style={{ backgroundColor: color }} /><span>{color}</span></div></SelectItem>)}</SelectContent></Select></div>}
              <div className="flex flex-col gap-1"><span>quantatiy</span><Select onValueChange={setSelectedquantity} ><SelectTrigger><SelectValue placeholder="quantatiy" />
              
              </SelectTrigger>
              <SelectContent> 
                   <SelectItem  value='1'>1 </SelectItem>
                   <SelectItem  value='2'>2 </SelectItem>
                   <SelectItem  value='3'>3 </SelectItem>

                   
              </SelectContent>
              </Select></div>
            
            </div>
            <div className="mt-6 sm:flex sm:items-center sm:gap-4"><Button variant="secondary" onClick={handleWishlist}><Heart className={`w-5 h-5 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} /> Wishlist</Button>
            <Button onClick={() => addCart({ color: selectedColor || colorsArray[0] || '', product_id: Number(productId), quantity:selectedquantity, size: selectedSize || sizesArray[0] || '' })}><ShoppingCart className="w-5 h-5" /> Add to cart</Button></div>
            <hr className="my-6" /><p className="mb-6 text-gray-500">{product?.description || "No description"}</p>
          </div>
        </div>

        {/* قسم التقييمات */}
        <div className="mt-16">
          {/* قسم التقييمات */}
<div className="mt-16">
  <div className="flex justify-between items-center mb-6">
    <div>
      <h2 className="text-2xl font-bold">Customer Reviews</h2>
      <div className="flex items-center gap-2 mt-1">
        <div className="flex">
          {Array(5).fill(0).map((_, i) => (
            <StarIcon 
              key={i} 
              className={`w-5 h-5 ${
                i < Math.floor(Number(avgRating)) 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-gray-300"
              }`} 
            />
          ))}
        </div>
        <span>{avgRating} out of 5</span>
        <span className="text-gray-400">({reviews?.length || 0} reviews)</span>
      </div>
    </div>
    <Button onClick={() => setShowReviewModal(true)} className="flex items-center gap-2">
      <MessageSquare className="w-4 h-4" /> Write a Review
    </Button>
  </div>
</div>
          
          {/* عرض التقييمات */}
          {reviews.length > 0 ? (
            reviews.map((review: any, index: number) => (
              <Card key={index} className="p-6 mb-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center text-white font-semibold">
                    {review.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="font-semibold">{review.user?.name || review.user || 'Anonymous'}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon key={i} className={`w-4 h-4 ${i < review.rate ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{review.message}</p>
                    {review.image_url && (
                      <img src={review.image_url} alt="Review" className="mt-2 w-24 h-24 object-cover rounded" />
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>

        {/* مودال كتابة التقييم */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
              <h3 className="text-xl font-bold">Write a Review</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setReviewRate(star)} onMouseEnter={() => setHoveredRate(star)} onMouseLeave={() => setHoveredRate(0)} className="focus:outline-none">
                      <Star className={`w-8 h-8 ${(hoveredRate || reviewRate) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} transition-colors`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Your Review</label>
                <textarea value={reviewMessage} onChange={(e) => setReviewMessage(e.target.value)} rows={4} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500" placeholder="Share your experience..." />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload Image (Optional)</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Choose
                    <input type="file" accept="image/*" onChange={handleReviewImageUpload} className="hidden" />
                  </label>
                  {reviewImagePreview && (
                    <div className="relative">
                      <img src={reviewImagePreview} className="w-16 h-16 object-cover rounded" alt="preview" />
                      <button onClick={() => { setReviewImage(null); setReviewImagePreview(""); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowReviewModal(false)}>Cancel</Button>
                <Button onClick={handleSubmitReview} disabled={createReviewMutation.isPending}>
                  {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SingleProduct;