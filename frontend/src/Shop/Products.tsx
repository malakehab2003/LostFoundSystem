import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useProducts } from "@/features/products/hooks/useProducts";
import { useAddToWishlist } from "@/features/wishlist/hooks/useAddToWishlist";
import { useDeleteFromWishlist } from "@/features/wishlist/hooks/useDeleteFromWishlist";
import { useCreateProduct } from "@/features/products/hooks/useCreateProduct";

import { useWishlist } from "@/features/wishlist/hooks/useWishlist";

import { useEditProduct } from "@/features/products/hooks/useEditProduct";
import { useDeleteProduct } from "@/features/products/hooks/useDeleteProduct";

import {
  FunnelIcon,
  Heart,
  ShoppingCart,
  SortAscIcon,
  StarIcon,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useState } from "react";
import toast from "react-hot-toast";

import { useGetItemCategory } from "@/features/auth/itemCategory/hooks/useGetItemCategory";

const Products = () => {
  const navigate = useNavigate();

  const { products, isLoading } = useProducts();

  const { wishlist } = useWishlist();
  const { addToWishlist } = useAddToWishlist();
  const { deleteFromWishlist } = useDeleteFromWishlist();

  const { user } = useCurrentUser();
  const isAdmin = user?.role === "admin";

  const { editProduct, isPending: isEditing } = useEditProduct();
  const { deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const { createProduct, isPending: isCreating } = useCreateProduct();

  const { itemCategories } = useGetItemCategory();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [createData, setCreateData] = useState({
    name: "",
    price: 0,
    description: "",
    color: [] as string[],
    size: [] as string[],
    category_id: 0, // 0 يعني لم يتم الاختيار بعد
  });

  const handleCreate = () => {
    // التحقق من اختيار category
    if (!createData.category_id || createData.category_id === 0) {
      toast.error("Please select a category");
      return;
    }

    // التحقق من تعبئة الحقول الأساسية
    if (!createData.name.trim()) {
      toast.error("Please enter product name");
      return;
    }

    if (createData.price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const productData = {
      name: createData.name,
      price: createData.price,
      description: createData.description,
      category_id: createData.category_id, // ✅ استخدام category_id
      colors: createData.color,
      sizes: createData.size,
      brand_id: 1,
      stock: 100,
      images_url: [
        "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.jpg",
      ],
      sale: 20,
      rate: 4,
    };

    console.log("Sending product data:", productData); // للتأكد من البيانات

    createProduct(productData);

    // إعادة تعيين الفورم
    setCreateData({
      name: "",
      price: 0,
      description: "",
      color: [],
      size: [],
      category_id: 0,
    });

    setIsCreateOpen(false);
  };

  // EDIT
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
  });

  const isProductInWishlist = (productId: number) =>
    wishlist?.some((item: any) => item.product_id === productId);

  const handleWishlist = (productId: number) => {
    isProductInWishlist(productId)
      ? deleteFromWishlist(productId)
      : addToWishlist(productId);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    editProduct({
      productId: selectedProduct.id,
      data: formData,
    });

    setIsEditOpen(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure?")) return;
    deleteProduct(id);
  };

  return (
    <>
      <div className="bg-gray-50 py-8 antialiased md:py-12 mx-auto max-w-screen-xl px-4 2xl:px-0">
        {/* HEADER */}
        <div className="mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8">
          <div>
            <h2 className="mt-3 text-xl font-semibold text-foreground/90 sm:text-2xl">
              Our Products
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Button onClick={() => setIsCreateOpen(true)}>
                + Add Product
              </Button>
            )}

            <button className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
              <FunnelIcon className="w-4 h-4" />
              Filters
            </button>

            <button className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
              <SortAscIcon className="w-4 h-4" />
              Sort
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <Spinner className="w-8 h-8 text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products?.map((product) => (
              <div
                key={product.id}
                className="rounded-lg border bg-white p-6 shadow-sm"
              >
                <Link to={`/shop/products/${product.id}`}>
                  <img
                    className="mx-auto h-56"
                    src={
                      product.image?.[0]?.image_url ||
                      "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"
                    }
                    alt={product.name}
                  />
                </Link>

                <div className="pt-6">
                  <div className="flex justify-between mb-4">
                    <Button
                      variant="secondary"
                      onClick={() => handleWishlist(product.id)}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isProductInWishlist(product.id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                      Wishlist
                    </Button>

                    <Badge>{product.category?.name}</Badge>
                  </div>

                  <Link
                    to={`/shop/products/${product.id}`}
                    className="font-semibold"
                  >
                    {product.name}
                  </Link>

                  <p className="text-sm text-gray-500 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(product.rate)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    <p className="font-bold text-lg">${product.price}</p>

                    <Button
                      onClick={() => navigate(`/shop/products/${product.id}`)}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to cart
                    </Button>

                    {isAdmin && (
                      <div className="flex flex-col gap-2">
                        <Button
                          className="w-full"
                          variant="secondary"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </Button>

                        <Button
                          className="w-full"
                          variant="destructive"
                          disabled={isDeleting}
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {isEditOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[400px] space-y-4">
            <h2 className="font-bold text-lg">Edit Product</h2>

            <input
              className="border w-full p-2"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="number"
              className="border w-full p-2"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: Number(e.target.value),
                })
              }
            />

            <textarea
              className="border w-full p-2"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsEditOpen(false)}>Close</Button>

              <Button onClick={handleSaveEdit} disabled={isEditing}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[400px] space-y-4">
            <h2 className="font-bold text-lg">Add Product</h2>

            <input
              className="border w-full p-2"
              placeholder="Name"
              value={createData.name}
              onChange={(e) =>
                setCreateData({ ...createData, name: e.target.value })
              }
            />

            <input
              className="border w-full p-2"
              placeholder="Colors (comma separated)"
              value={createData.color.join(",")}
              onChange={(e) =>
                setCreateData({
                  ...createData,
                  color: e.target.value.split(",").map((c) => c.trim()),
                })
              }
            />

            <input
              className="border w-full p-2"
              placeholder="Sizes (comma separated)"
              value={createData.size.join(",")}
              onChange={(e) =>
                setCreateData({
                  ...createData,
                  size: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />

            {/* CATEGORY SELECT */}
            <select
              className="border w-full p-2"
              value={createData.category_id || ""}
              onChange={(e) =>
                setCreateData({
                  ...createData,
                  category_id: Number(e.target.value),
                })
              }
            >
              <option value="">Select Category</option>
              {itemCategories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              className="border w-full p-2"
              placeholder="Price"
              type="number"
              value={createData.price || ""}
              onChange={(e) =>
                setCreateData({
                  ...createData,
                  price: Number(e.target.value),
                })
              }
            />

            <textarea
              className="border w-full p-2"
              placeholder="Description"
              value={createData.description}
              onChange={(e) =>
                setCreateData({
                  ...createData,
                  description: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsCreateOpen(false)}>Cancel</Button>

              <Button onClick={handleCreate} disabled={isCreating}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
