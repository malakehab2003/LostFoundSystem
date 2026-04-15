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
import { useProduct } from "@/features/products/hooks/useProduct";
import { useAddToWishlist } from "@/features/wishlist/hooks/useAddToWishlist";
import { useDeleteFromWishlist } from "@/features/wishlist/hooks/useDeleteFromWishlist";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { useWishlistToggle } from "@/features/wishlist/hooks/useWishlistToggle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, ShoppingCart, StarIcon } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const SingleProduct = () => {

  const { productId } = useParams();
  const { product, isLoading } = useProduct(Number(productId));
  const { wishlist } = useWishlist();
  const { addToWishlist } = useAddToWishlist();
  const { deleteFromWishlist } = useDeleteFromWishlist();

  const isInWishlist = wishlist?.some(
    (item) => item.product_id === product?.id,
  );
  function handleWishlist() {
    if (!product?.id) return;
    console.log(isInWishlist, productId, product.id);
    if (isInWishlist) {
      deleteFromWishlist(product?.id);
    } else {
      addToWishlist(product?.id);
    }
  }
  console.log(wishlist);

////////////get data to cart

const [selectedSize, setSelectedSize] = useState('');
const [selectedColor, setSelectedColor] = useState('');
const [quantity, setQuantity] = useState(1);

 const vaules={
   color: selectedColor,
    size: selectedSize,
    product_id: productId,
    quantity: quantity,

  }
  ////add to cart function
    const queryClient=useQueryClient()


  const { mutate: addCart ,data} = useMutation({
  mutationFn:(data)=>addToCart(data),
  onSuccess: () => {
    toast.success('Product added to cart!');
    queryClient.invalidateQueries({
      queryKey:['get cart']
    })
  },
  onError:() => {
    toast.error('Product error');
  },
});
console.log(data)
  return (
    <section className="py-8 bg-gray-50 md:py-16 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
            {isLoading ? (
              <div className="text-center justify-center items-center content-center h-full">
                <Spinner className="w-8 h-8 place-self-center text-primary" />
              </div>
            ) : (
              <img
                className="w-full dark:hidden"
                src={`${product?.image[0] || "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"}`}
                alt=""
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
                  {product?.name}
                </h1>
                <Badge
                  variant={"outline"}
                  className="text-xs font-semibold leading-tight text-foreground/80 line-clamp-2"
                >
                  {product?.category?.name}
                </Badge>
              </div>
              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-2xl font-semibold text-foreground/80 sm:text-3xl">
                  ${product?.price}
                </p>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex items-center ">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        className={`w-4 h-4 ${
                          i < Math.round(product?.rate)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-yellow-400"
                        }`}
                        key={i}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {product?.rate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm my-4">
                <div className="flex flex-col gap-1">
                  <span className="text-foreground/80">Size</span>
                  <Select
                  onValueChange={(value)=>{setSelectedSize(value)}}
                    name="size"
                    defaultValue={
                      product?.sizes?.length ? product.sizes[0] : undefined
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>

                    <SelectContent >
                      {product?.sizes?.map((size) => (
                        <SelectItem value={size} key={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-foreground/80">Color</span>
                  <Select
                  onValueChange={(value)=>{setSelectedColor(value)}}
                    name="color"
                    defaultValue={
                      product?.colors?.length ? product.colors[0] : undefined
                    }
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent className="space-y-1">
                      {product?.colors?.map((color) => (
                        <SelectItem
                          value={color}
                          key={color}
                          className={`cursor-pointer rounded-full p-[1.2px]`}
                        >
                          <div
                            className="w-[14px] h-[14px] rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs text-foreground-800">
                            {color}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    className="group"
                    variant={"secondary"}
                    onClick={handleWishlist}
                  >
                    <Heart
                      className={`w-5 h-5 transition duration-200
      ${
        isInWishlist
          ? "fill-red-500 text-red-500"
          : "group-hover:fill-red-500 group-h)over:text-red-500"
      }`}
                    />
                    <span>
                      {isInWishlist
                        ? "Remove from wishlist"
                        : "Add to wishlist"}
                    </span>
                  </Button>
                </div>

                <Button  onClick={() =>  addCart({
      color: selectedColor,     
     product_id: Number(productId),
      quantity: quantity,   
      size: selectedSize
    })
}  type="button" variant={"default"}>
                  <ShoppingCart className="w-5 h-5" />
                  Add to cart
                </Button>
              </div>

              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

              <p className="mb-6 text-gray-500 dark:text-gray-400">
                {product?.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SingleProduct;
