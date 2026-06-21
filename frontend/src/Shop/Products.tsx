import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  Package,
  Upload,
  X,
  SlidersHorizontal,
  Building2,
} from "lucide-react";

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAddProductImage } from "@/features/products/hooks/useAddProductImage";
import { useDeleteProductImage } from "@/features/products/hooks/useDeleteProductImage";
import { useGetItemCategory } from "@/features/auth/itemCategory/hooks/useGetItemCategory";
import { useBrands } from "@/features/brand/hooks/useBrands";

interface ProductFilters {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  category_id?: number;
  minRate?: number;
  inStock?: boolean;
}

const Products = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [isRefetching, setIsRefetching] = useState(false);

  const [filters, setFilters] = useState<ProductFilters>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { products, isLoading, pagination, refetch } = useProducts(currentPage, 12, filters);
  const { wishlist } = useWishlist();
  const { addToWishlist } = useAddToWishlist();
  const { deleteFromWishlist } = useDeleteFromWishlist();

  const { user } = useCurrentUser();
  const isAdmin = user?.role === "admin";
  const { itemCategories } = useGetItemCategory();
  const { brands } = useBrands();

  const [editImages, setEditImages] = useState<File[]>([]);
  const [editPreviews, setEditPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  const { editProduct, isPending: isEditing } = useEditProduct();
  const { deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const { createProduct, isPending: isCreating } = useCreateProduct();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { addImage, isPending: isAddingImage } = useAddProductImage();
  const { deleteImage, isPending: isDeletingImage } = useDeleteProductImage();

  const [createData, setCreateData] = useState({
    name: "",
    price: 0,
    description: "",
    color: [] as string[],
    size: [] as string[],
    category_id: 0,
    brand_id: 0,
    stock: 0,
    sale: 0,
  });

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" || value === undefined ? undefined : value,
    }));
    setSearchParams({ page: "1" });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchParams({ page: "1" });
  };

  const hasFilters = Object.keys(filters).filter(
    (k) => filters[k as keyof ProductFilters] !== undefined
  ).length > 0;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveEdit = () => {
    if (!selectedProduct) return;

    const hasNewImages = editImages.length > 0;
    const hasDataChanges =
      formData.name !== selectedProduct.name ||
      formData.price !== selectedProduct.price ||
      formData.description !== selectedProduct.description ||
      formData.stock !== selectedProduct.stock ||
      formData.sale !== selectedProduct.sale;

    if (!hasDataChanges && !hasNewImages) {
      toast.info("No changes to save");
      setIsEditOpen(false);
      return;
    }

    if (!hasNewImages) {
      const jsonData = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        stock: Number(formData.stock),
        sale: Number(formData.sale),
      };

      editProduct(
        {
          productId: selectedProduct.id,
          data: jsonData,
        },
        {
          onSuccess: () => {
            setSearchParams({ page: currentPage.toString() });
            setIsEditOpen(false);
            refetch();
            toast.success("Product updated successfully");
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to update product");
          },
        }
      );
    } else {
      addImage({
        owner_id: selectedProduct.id,
        owner_type: "product",
        images: editImages,
      });
      setIsEditOpen(false);
      setEditImages([]);
      setEditPreviews([]);
      setTimeout(() => refetch(), 1000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    setSelectedImages((prev) => [...prev, ...filesArray]);

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCreate = () => {
    if (!createData.category_id || createData.category_id === 0) {
      toast.error("Please select a category");
      return;
    }

    if (!createData.brand_id || createData.brand_id === 0) {
      toast.error("Please select a brand");
      return;
    }

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
      category_id: createData.category_id,
      brand_id: createData.brand_id,
      colors: createData.color,
      sizes: createData.size,
      stock: createData.stock || 0,
      sale: createData.sale || 0,
      rate: 0,
      images: selectedImages.length > 0 ? selectedImages : undefined,
    };

    console.log("Sending product data:", productData);
    setIsRefetching(true);

    createProduct(productData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["products"] });
        setSearchParams({ page: "1" });
        setCreateData({
          name: "",
          price: 0,
          description: "",
          color: [],
          size: [],
          category_id: 0,
          brand_id: 0,
          stock: 0,
          sale: 0,
        });
        setSelectedImages([]);
        setImagePreviews([]);
        setIsCreateOpen(false);
        setIsRefetching(false);
      },
      onError: () => {
        setIsRefetching(false);
      },
    });
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    stock: 0,
    sale: 0,
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
      stock: product.stock || 0,
      sale: product.sale || 0,
    });
    setExistingImages(product.image || []);
    setEditImages([]);
    setEditPreviews([]);
    setIsEditOpen(true);
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    setEditImages((prev) => [...prev, ...filesArray]);

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    toast.success(`${filesArray.length} image(s) selected. They will be saved when you click Save.`);
  };

  const handleDeleteImage = (imageId: number) => {
    deleteImage(
      {
        imageId: imageId,
        productId: selectedProduct.id,
      },
      {
        onSuccess: () => {
          refetch();
          setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure?")) return;
    deleteProduct(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        refetch();
      },
    });
  };

  useEffect(() => {
    console.log("Pagination data:", pagination);
    console.log("Total pages:", pagination?.totalPages);
    console.log("Current page:", currentPage);
  }, [pagination, currentPage]);

  return (
    <>
      <div className="py-8 antialiased md:py-12 mx-auto max-w-screen-xl px-4 2xl:px-0">
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

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <button className="relative flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {hasFilters && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-10 mt-6">
                  <div className="space-y-2 ps-4">
                    <Label>Product Name</Label>
                    <Input
                      placeholder="Search by name..."
                      value={filters.name || ""}
                      onChange={(e) => updateFilter("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 ps-4">
                    <Label>Category</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={filters.category_id || ""}
                      onChange={(e) => updateFilter("category_id", Number(e.target.value) || undefined)}
                    >
                      <option value="">All Categories</option>
                      {itemCategories?.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 ps-4">
                    <Label>Brand</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={filters.brand_id || ""}
                      onChange={(e) => updateFilter("brand_id", Number(e.target.value) || undefined)}
                    >
                      <option value="">All Brands</option>
                      {brands?.map((brand: any) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 ps-4">
                    <Label>Price Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice || ""}
                        onChange={(e) => updateFilter("minPrice", Number(e.target.value))}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice || ""}
                        onChange={(e) => updateFilter("maxPrice", Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ps-4">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={filters.inStock || false}
                      onChange={(e) => updateFilter("inStock", e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="inStock" className="cursor-pointer">
                      In Stock Only
                    </Label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    {hasFilters && (
                      <Button variant="outline" onClick={() => { clearFilters(); setIsFilterOpen(false); }} className="flex-1">
                        <X className="w-4 h-4 mr-1" /> Clear
                      </Button>
                    )}
                    <Button onClick={() => setIsFilterOpen(false)} className="flex-1">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {isLoading || isRefetching ? (
          <div className="text-center py-20">
            <Spinner className="w-8 h-8 text-primary" />
            <p className="mt-2 text-gray-500">Loading products...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {products?.map((product: any) => (
                <div key={product.id} className="rounded-lg border bg-white p-6 shadow-sm">
                  <Link to={`/shop/products/${product.id}`}>
                    <img
                      className="mx-auto h-56 object-cover"
                      src={
                        product.image?.[0]?.url ||
                        "https://placehold.co/400x400?text=No+Image"
                      }
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
                      }}
                    />
                  </Link>
                  <div className="pt-6">
                    <div className="flex justify-between mb-4">
                      <Button variant="secondary" onClick={() => handleWishlist(product.id)}>
                        <Heart className={`w-5 h-5 ${isProductInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                        Wishlist
                      </Button>
                      <Badge>{product.category?.name}</Badge>
                    </div>
                    <Link to={`/shop/products/${product.id}`} className="font-semibold">
                      {product.name}
                    </Link>
                    
                    {/* Brand Display */}
                    {product.brand && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Building2 className="w-3 h-3" />
                        <span>{product.brand.name}</span>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-500 line-clamp-2 mt-2">{product.description.split(' ').slice(0, 3).join(' ')}</p>
                    <div className="flex gap-1 mt-2">
                      {(() => {
                        let rating = product.rate;
                        if (product.review && product.review.length > 0) {
                          const sum = product.review.reduce((acc: number, r: any) => acc + r.rate, 0);
                          rating = sum / product.review.length;
                        }
                        const fullStars = Math.floor(rating);
                        return Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < fullStars
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ));
                      })()}
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {product.sale > 0 ? (
                          <>
                            <p className="font-bold text-green-600 text-lg">
                              ${(product.price - (product.price * product.sale / 100)).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-400 line-through">
                              ${product.price}
                            </p>
                            <Badge variant="destructive" className="text-xs">
                              -{product.sale}%
                            </Badge>
                          </>
                        ) : (
                          <p className="font-bold text-green-600 text-lg">${product.price}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className={product.stock > 0 ? "text-blue-800" : "text-red-500"}>
                          Stock: {product.stock || 0} units
                        </span>
                      </div>
                      <Button onClick={() => navigate(`/shop/products/${product.id}`)}>
                        <ShoppingCart className="w-5 h-5" /> Add to cart
                      </Button>
                      {isAdmin && (
                        <div className="flex flex-col gap-2">
                          <Button className="w-full" variant="secondary" onClick={() => handleEdit(product)}>Edit</Button>
                          <Button className="w-full" variant="destructive" disabled={isDeleting} onClick={() => handleDelete(product.id)}>Delete</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
                      {/* Pagination */}
            {pagination && pagination.totalPages >= 1 && (
             <div className="mt-12 pt-6 border-t border-gray-200">
    <div className="flex justify-center gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        ← Previous
      </Button>
      
<<<<<<< HEAD
      {/* عرض الصفحات من 1 إلى 5 */}
=======
>>>>>>> refs/remotes/origin/master
      {Array.from({ length: 3 }, (_, i) => i + 1)
        .map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(pageNum)}
            className="min-w-[40px]"
          >
            {pageNum}
          </Button>
        ))
      }
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => currentPage < 5 && handlePageChange(currentPage + 1)}
        disabled={currentPage >= 5}
      >
        Next →
      </Button>
    </div>
  </div>
            )}
            {hasFilters && (
              <div className="flex justify-center mt-4">
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500">
                  <X className="w-4 h-4 mr-1" /> Clear all filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* EDIT MODAL */}
      {isEditOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto space-y-4">
            <h2 className="font-bold text-lg">Edit Product</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition" onClick={() => fileInputRef.current?.click()}>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleEditImageUpload} />
              {existingImages.length > 0 || editPreviews.length > 0 ? (
                <div className="flex flex-wrap gap-3 justify-center">
                  {existingImages.map((img, index) => (
                    <div key={`old-${index}`} className="relative">
                      <img src={img.url || img.image_url || img} className="h-24 w-24 object-cover rounded" alt="existing" />
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteImage(img.id); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                  {editPreviews.map((src, index) => (
                    <div key={`new-${index}`} className="relative">
                      <img src={src} className="h-24 w-24 object-cover rounded" alt="preview" />
                      <button onClick={(e) => { e.stopPropagation(); setEditPreviews(prev => prev.filter((_, i) => i !== index)); setEditImages(prev => prev.filter((_, i) => i !== index)); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              ) : (
                <div><Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" /><p className="text-sm text-gray-500">Click to upload product images</p></div>
              )}
            </div>

            {/* Edit Form */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Product Name</Label>
                <input
                  className="border w-full p-2 rounded mt-1"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Price</Label>
                <input
                  type="number"
                  className="border w-full p-2 rounded mt-1"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Sale (%)</Label>
                <input
                  type="number"
                  className="border w-full p-2 rounded mt-1"
                  placeholder="Sale percentage (e.g., 20 for 20% off)"
                  value={formData.sale}
                  onChange={(e) => setFormData({ ...formData, sale: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Stock</Label>
                <input
                  type="number"
                  className="border w-full p-2 rounded mt-1"
                  placeholder="Stock Quantity"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <textarea
                  className="border w-full p-2 rounded mt-1"
                  placeholder="Description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setIsEditOpen(false)}>Close</Button>
              <Button onClick={handleSaveEdit} disabled={isEditing || isAddingImage || isDeletingImage}>
                {isEditing || isAddingImage || isDeletingImage ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto space-y-4">
            <h2 className="font-bold text-lg">Add Product</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Product Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                {imagePreviews.length > 0 ? (
                  <div className="flex flex-wrap gap-3 justify-center">
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="relative">
                        <img src={src} alt={`Preview-${index}`} className="h-24 w-24 object-cover rounded-lg" />
                        <button onClick={(e) => { e.stopPropagation(); setImagePreviews(prev => prev.filter((_, i) => i !== index)); setSelectedImages(prev => prev.filter((_, i) => i !== index)); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div><Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" /><p className="text-sm text-gray-500">Click to upload product images</p></div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Product Name</Label>
                <input
                  className="border w-full p-2 rounded mt-1"
                  placeholder="Product Name"
                  value={createData.name}
                  onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Colors (comma separated)</Label>
                <input
                  className="border w-full p-2 rounded mt-1"
                  placeholder="e.g., Black, Silver, Red"
                  value={createData.color.join(",")}
                  onChange={(e) => setCreateData({ ...createData, color: e.target.value.split(",").map(c => c.trim()) })}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Sizes (comma separated)</Label>
                <input
                  className="border w-full p-2 rounded mt-1"
                  placeholder="e.g., S, M, L, XL"
                  value={createData.size.join(",")}
                  onChange={(e) => setCreateData({ ...createData, size: e.target.value.split(",").map(s => s.trim()) })}
                />
              </div>
              
              {/* Category Select */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Category</Label>
                <select
                  className="border w-full p-2 rounded mt-1"
                  value={createData.category_id || ""}
                  onChange={(e) => setCreateData({ ...createData, category_id: Number(e.target.value) })}
                >
                  <option value="">Select Category</option>
                  {itemCategories?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Brand Select */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Brand</Label>
                <select
                  className="border w-full p-2 rounded mt-1"
                  value={createData.brand_id || ""}
                  onChange={(e) => setCreateData({ ...createData, brand_id: Number(e.target.value) })}
                >
                  <option value="">Select Brand</option>
                  {brands?.map((brand: any) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Price</Label>
                <input
                  className="border w-full p-2 rounded mt-1"
                  placeholder="Price"
                  type="number"
                  value={createData.price || ""}
                  onChange={(e) => setCreateData({ ...createData, price: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Sale (%)</Label>
                <input
                  className="border w-full p-2 rounded mt-1"
                  placeholder="Sale percentage (e.g., 20 for 20% off)"
                  type="number"
                  value={createData.sale || ""}
                  onChange={(e) => setCreateData({ ...createData, sale: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Stock Quantity</Label>
                <input
                  className="border w-full p-2 rounded mt-1"
                  placeholder="Stock Quantity"
                  type="number"
                  value={createData.stock || ""}
                  onChange={(e) => setCreateData({ ...createData, stock: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <textarea
                  className="border w-full p-2 rounded mt-1"
                  placeholder="Description"
                  rows={3}
                  value={createData.description}
                  onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => { setIsCreateOpen(false); setSelectedImages([]); setImagePreviews([]); }}>Cancel</Button>
              <Button onClick={handleCreate} disabled={isCreating || isRefetching}>
                {isCreating || isRefetching ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;