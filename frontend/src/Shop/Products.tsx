import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useAddToWishlist } from "@/features/wishlist/hooks/useAddToWishlist";
import { useDeleteFromWishlist } from "@/features/wishlist/hooks/useDeleteFromWishlist";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import {
  FunnelIcon,
  Heart,
  ShoppingCart,
  SortAscIcon,
  StarIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const Products = () => {
  const { products, isLoading } = useProducts();

  const { wishlist } = useWishlist();
  const { addToWishlist } = useAddToWishlist();
  const { deleteFromWishlist } = useDeleteFromWishlist();

  const isProductInWishlist = (productId: number) =>
    wishlist?.some(
      (item: { product_id: number }) => item.product_id === productId,
    );
  const handleWishlist = (productId: number) => {
    if (!productId) return;
    if (isProductInWishlist(productId)) {
      deleteFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };
  return (
    <div className="bg-gray-50 py-8 antialiased md:py-12 mx-auto max-w-screen-xl px-4 2xl:px-0">
      <div className="mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8">
        <div>
          <h2 className="mt-3 text-xl font-semibold text-foreground/90 sm:text-2xl">
            Our Products
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <button
            data-modal-toggle="filterModal"
            data-modal-target="filterModal"
            type="button"
            className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
          >
            <SortAscIcon className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center justify-center items-center content-center h-full">
          <Spinner className="w-8 h-8 place-self-center text-primary" />
        </div>
      ) : (
        <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => (
            <div
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              key={product.id}
            >
              <div className="h-56 w-full">
                <Link to={`/shop/products/${product.id}`}>
                  <img
                    className="mx-auto h-full"
                    src={`${product.image[0] || "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"}`}
                    alt={product.name}
                  />
                </Link>
              </div>
              <div className="pt-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      className="group"
                      variant={"secondary"}
                      onClick={() => handleWishlist(product.id)}
                    >
                      <Heart
                        className={`w-5 h-5 transition duration-200
      ${
        isProductInWishlist(product.id)
          ? "fill-red-500 text-red-500"
          : "group-hover:fill-red-500 group-hover:text-red-500"
      }`}
                      />
                      <span>
                        {isProductInWishlist(product.id)
                          ? "Remove from wishlist"
                          : "Add to wishlist"}
                      </span>
                    </Button>
                  </div>
                  <Badge
                    variant={"outline"}
                    className="text-xs font-semibold leading-tight text-foreground/80 line-clamp-2"
                  >
                    {product.category.name}
                  </Badge>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <Link
                    to={`/shop/products/${product.id}`}
                    className="text-lg font-semibold leading-tight text-foreground/90 hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm font-normal leading-tight text-foreground/70 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-2">
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
                    {product.rate}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-xl font-semibold leading-tight text-foreground/90">
                    ${product.price}
                  </p>

                  <Button type="button" variant={"default"}>
                    <ShoppingCart className="w-5 h-5" />
                    Add to cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
