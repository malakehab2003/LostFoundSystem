// components/FilterSheet.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";
import { useGetItemCategory } from "@/features/auth/itemCategory/hooks/useGetItemCategory";

interface FilterSheetProps {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

export function FilterSheet({ filters, onFilterChange, onClearFilters, hasFilters }: FilterSheetProps) {
  const { itemCategories } = useGetItemCategory();

  return (
    <Sheet>
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
        
        <div className="flex flex-col gap-5 mt-6">
          {/* Search by name */}
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input
              placeholder="Search by name..."
              value={filters.name || ""}
              onChange={(e) => onFilterChange("name", e.target.value)}
            />
          </div>

          {/* Category filter */}
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={filters.category_id || ""}
              onChange={(e) => onFilterChange("category_id", Number(e.target.value) || undefined)}
            >
              <option value="">All Categories</option>
              {itemCategories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price range */}
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ""}
                onChange={(e) => onFilterChange("minPrice", Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ""}
                onChange={(e) => onFilterChange("maxPrice", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Rating filter */}
          <div className="space-y-2">
            <Label>Minimum Rating</Label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={filters.minRate || ""}
              onChange={(e) => onFilterChange("minRate", Number(e.target.value) || undefined)}
            >
              <option value="">Any Rating</option>
              <option value="4">4★ & above</option>
              <option value="3">3★ & above</option>
              <option value="2">2★ & above</option>
              <option value="1">1★ & above</option>
            </select>
          </div>

          {/* In Stock filter */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="inStock"
              checked={filters.inStock || false}
              onChange={(e) => onFilterChange("inStock", e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="inStock" className="cursor-pointer">
              In Stock Only
            </Label>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            {hasFilters && (
              <Button variant="outline" onClick={onClearFilters} className="flex-1">
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
            <SheetTrigger asChild>
              <Button className="flex-1">Apply Filters</Button>
            </SheetTrigger>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}