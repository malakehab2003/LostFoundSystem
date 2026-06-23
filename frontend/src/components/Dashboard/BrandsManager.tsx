import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, X, Check,Package  } from "lucide-react";
import { useBrands } from "@/features/brand/hooks/useBrands";
import { useCreateBrand } from "@/features/brand/hooks/useCreateBrand";
import { useUpdateBrand } from "@/features/brand/hooks/useUpdateBrand";
import { useDeleteBrand } from "@/features/brand/hooks/useDeleteBrand";
import toast from "react-hot-toast";

const BrandsManager = () => {
  const { brands, isLoading, refetch } = useBrands();
  const { mutate: createBrand, isPending: isCreating } = useCreateBrand();
  const { mutate: updateBrand, isPending: isUpdating } = useUpdateBrand();
  const { mutate: deleteBrand, isPending: isDeleting } = useDeleteBrand();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [editingBrand, setEditingBrand] = useState<{ id: number; name: string } | null>(null);

  const handleCreateBrand = () => {
    if (!newBrandName.trim()) {
      toast.error("Please enter brand name");
      return;
    }
    createBrand(newBrandName, {
      onSuccess: () => {
        setNewBrandName("");
        setIsAddModalOpen(false);
      },
    });
  };

  const handleUpdateBrand = () => {
    if (!editingBrand || !editingBrand.name.trim()) {
      toast.error("Please enter brand name");
      return;
    }
    updateBrand(
      { id: editingBrand.id, name: editingBrand.name },
      {
        onSuccess: () => {
          setEditingBrand(null);
        },
      }
    );
  };

  const handleDeleteBrand = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteBrand(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Brands Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product brands</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary hover:bg-primary/90 rounded-full gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </Button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands?.map((brand) => (
          <Card key={brand.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {editingBrand?.id === brand.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <Input
                    value={editingBrand.name}
                    onChange={(e) =>
                      setEditingBrand({ ...editingBrand, name: e.target.value })
                    }
                    className="rounded-xl"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleUpdateBrand}
                      disabled={isUpdating}
                      className="flex-1 gap-1 bg-green-500 hover:bg-green-600"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingBrand(null)}
                      className="flex-1 gap-1"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{brand.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">ID: {brand.id}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {new Date(brand.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingBrand({ id: brand.id, name: brand.name })}
                      className="flex-1 gap-1"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteBrand(brand.id, brand.name)}
                      disabled={isDeleting}
                      className="flex-1 gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(!brands || brands.length === 0) && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No brands found</p>
          <Button
            variant="outline"
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 rounded-full"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add your first brand
          </Button>
        </div>
      )}

      {/* Add Brand Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Brand</h2>
            <Input
              placeholder="Enter brand name"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              className="mb-4 rounded-xl"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateBrand();
              }}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewBrandName("");
                }}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBrand}
                disabled={isCreating}
                className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
              >
                {isCreating ? "Creating..." : "Create Brand"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandsManager;