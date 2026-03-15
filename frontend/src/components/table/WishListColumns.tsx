"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Trash2Icon } from "lucide-react";
import type { Product } from "@/features/products/productType";
import { useDeleteFromWishlist } from "@/features/wishlist/hooks/useDeleteFromWishlist";

export const columns: ColumnDef<Product>[] = [
  {
    header: "Product",
    cell: ({ row }) => (
      <div className="flex gap-5 items-center">
        <img
          src={
            row.original.image ||
            "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"
          }
          alt={row.original.name}
          className="w-20 h-20 object-cover rounded-md border border-gray-50 mr-2"
        />
        <div className="flex flex-col gap-1 items-start">
          <p className="text-base font-medium text-gray-900">
            {row.original.name}
          </p>
          <span className="text-xs text-gray-500 mb-3">
            {row.original.description}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <p className="text-base font-semibold text-gray-900">
        ${row.original.price}
      </p>
    ),
  },

  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex md:gap-1 items-center">
          <Button variant="outline" className={`capitalize cursor-pointer`}>
            <Link to={`/shop/products/${product.id}`}>View Product</Link>
          </Button>
          <RemoveProductFromWishlist productId={product.id} />
        </div>
      );
    },
  },
];

export const RemoveProductFromWishlist = ({
  productId,
}: {
  productId: number;
}) => {
  const { deleteFromWishlist } = useDeleteFromWishlist();

  return (
    <Button
      variant="ghost"
      className={`capitalize cursor-pointer text-red-600 hover:text-red-600`}
      onClick={() => deleteFromWishlist(productId)}
    >
      <Trash2Icon className="w-5 h-5" />
      Remove
    </Button>
  );
};
