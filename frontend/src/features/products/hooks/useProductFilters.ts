import { useState } from 'react';

export interface ProductFiltersType {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  category_id?: number;
  minRate?: number;
  inStock?: boolean;
}

export function useProductFilters() {
  const [filters, setFilters] = useState<ProductFiltersType>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const updateFilter = (key: keyof ProductFiltersType, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasFilters = Object.keys(filters).length > 0;

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    hasFilters,
    isFilterOpen,
    setIsFilterOpen,
  };
}