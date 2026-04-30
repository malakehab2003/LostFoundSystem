// SingleProduct.tsx - Complete working file with Carousel
import { addToCart } from "@/cart/serves/addTocart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SelectContent,
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useProduct } from "@/features/products/hooks/useProduct";
import { useAddToWishlist } from "@/features/wishlist/hooks/useAddToWishlist";
import { useDeleteFromWishlist } from "@/features/wishlist/hooks/useDeleteFromWishlist";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, ShoppingCart, StarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
  const { productId } = useParams();
  const { product, isLoading, error } = useProduct(Number(productId));
  const { wishlist } = useWishlist();
  const { addToWishlist } = useAddToWishlist();
  const { deleteFromWishlist } = useDeleteFromWishlist();

  useEffect(() => {
    if (product) {
      console.log("Product data for ID:", productId);
      console.log("Product:", product);
      console.log("Images:", product.image);
    }
  }, [product, productId]);

  const isInWishlist = wishlist?.some(
    (item) => item.product_id === product?.id,
  );

  function handleWishlist() {
    if (!product?.id) return;
    if (isInWishlist) {
      deleteFromWishlist(product?.id);
    } else {
      addToWishlist(product?.id);
    }
  }

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const queryClient = useQueryClient();

  const { mutate: addCart } = useMutation({
    mutationFn: (data) => addToCart(data),
    onSuccess: () => {
      toast.success('Product added to cart!');
      queryClient.invalidateQueries({
        queryKey: ['get cart']
      });
    },
    onError: (err) => {
      console.error("Add to cart error:", err);
      toast.error('Failed to add to cart');
    },
  });

  const getSizesArray = () => {
    if (!product?.sizes) return [];
    if (Array.isArray(product.sizes)) return product.sizes;
    if (typeof product.sizes === 'string') {
      return product.sizes.split(',').map(s => s.trim());
    }
    return [];
  };

  const getColorsArray = () => {
    if (!product?.colors) return [];
    if (Array.isArray(product.colors)) return product.colors;
    if (typeof product.colors === 'string') {
      return product.colors.split(',').map(c => c.trim());
    }
    return [];
  };

  const sizesArray = getSizesArray();
  const colorsArray = getColorsArray();

  const getImagesArray = () => {
    if (!product) return [];
    
    if (product.image && Array.isArray(product.image)) {
      return product.image.map((img: any) => img.url || img.image_url || img);
    }
    
    if (product.images_url && Array.isArray(product.images_url)) {
      return product.images_url;
    }
    
    if (product.images && Array.isArray(product.images)) {
      return product.images.map((img: any) => img.url || img);
    }
    
    return [];
  };

  const imagesArray = getImagesArray();
  const hasMultipleImages = imagesArray.length > 1;

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-500 mb-4">Product not found</p>
        <Button onClick={() => window.location.href = '/shop'}>
          Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <section className="py-8 bg-gray-50 md:py-16 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
            {isLoading ? (
              <div className="text-center justify-center items-center content-center h-full">
                <Spinner className="w-8 h-8 place-self-center text-primary" />
              </div>
            ) : hasMultipleImages ? (
              <Carousel className="w-full max-w-sm mx-auto">
                <CarouselContent>
                  {imagesArray.map((img: any, index: number) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <img
                              src={typeof img === 'string' ? img : img.url || img.image_url}
                              alt={`${product?.name} - ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/600x600?text=No+Image";
                              }}
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <img
                className="w-full rounded-lg object-cover"
                src={
                  product?.image?.[0]?.url ||
                  product?.image?.[0]?.image_url ||
                  product?.images_url?.[0] ||
                  "https://placehold.co/600x600?text=No+Image"
                }
                alt={product?.name || "Product"}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/600x600?text=No+Image";
                }}
              />
            )}
          </div>

          {isLoading ? (
            <div className="text-center justify-center items-center content-center h-full">
              <Spinner className="w-8 h-8 place-self-center text-primary" />
            </div>
          ) : (
            <div className="mt-6 sm:mt-8 lg:mt-0">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h1 className="text-xl font-semibold text-foreground/90 sm:text-2xl">
                  {product?.name || "Product Name"}
                </h1>
                <Badge
                  variant={"outline"}
                  className="text-xs font-semibold leading-tight text-foreground/80 line-clamp-2"
                >
                  {product?.category?.name || "Uncategorized"}
                </Badge>
              </div>

              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-2xl font-semibold text-foreground/80 sm:text-3xl">
                  ${product?.price?.toFixed(2) || "0.00"}
                </p>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        className={`w-4 h-4 ${
                          i < Math.round(product?.rate || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                        key={i}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {product?.rate || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm my-4">
                {sizesArray.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-foreground/80">Size</span>
                    <Select
                      onValueChange={(value) => setSelectedSize(value)}
                      name="size"
                      defaultValue={sizesArray[0]}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizesArray.map((size: string) => (
                          <SelectItem value={size} key={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {colorsArray.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-foreground/80">Color</span>
                    <Select
                      onValueChange={(value) => setSelectedColor(value)}
                      name="color"
                      defaultValue={colorsArray[0]}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorsArray.map((color: string) => (
                          <SelectItem value={color} key={color}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: color }}
                              />
                              <span>{color}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    className="group"
                    variant={"secondary"}
                    onClick={handleWishlist}
                  >
                    <Heart
                      className={`w-5 h-5 transition duration-200 ${
                        isInWishlist
                          ? "fill-red-500 text-red-500"
                          : "group-hover:fill-red-500 group-hover:text-red-500"
                      }`}
                    />
                    <span>
                      {isInWishlist
                        ? "Remove from wishlist"
                        : "Add to wishlist"}
                    </span>
                  </Button>
                </div>

                <Button
                  onClick={() =>
                    addCart({
                      color: selectedColor || (colorsArray[0] || ''),
                      product_id: Number(productId),
                      quantity: quantity,
                      size: selectedSize || (sizesArray[0] || ''),
                    })
                  }
                  type="button"
                  variant={"default"}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to cart
                </Button>
              </div>

              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

              <p className="mb-6 text-gray-500 dark:text-gray-400">
                {product?.description || "No description available"}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SingleProduct;