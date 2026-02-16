"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Trash2Icon } from "lucide-react";
type Product = {
  id: string;
  productId: string;
  userId: string;
  image: string;
  name: string;
  price: number;
  description: string;
};

export const products: Product[] = [
  {
    id: "1",
    productId: "1",
    userId: "user1",
    image:
      "https://cdn-tailgrids.b-cdn.net/3.0/e-commerce/wishlists/wishlist-02/image-2.png",
    name: "Product 1",
    price: 19.99,
    description: "This is a sample product description.",
  },
  {
    id: "2",
    productId: "2",
    userId: "user1",
    image:
      "https://cdn-tailgrids.b-cdn.net/3.0/e-commerce/wishlists/wishlist-02/image-2.png",
    name: "Product 2",
    price: 29.99,
    description: "This is a sample product description.",
  },
  {
    id: "3",
    productId: "3",
    userId: "user1",
    image:
      "https://cdn-tailgrids.b-cdn.net/3.0/e-commerce/wishlists/wishlist-02/image-2.png",
    name: "Product 3",
    price: 39.99,
    description: "This is a sample product description.",
  },
];

export const columns: ColumnDef<Product>[] = [
  {
    header: "Product",
    cell: ({ row }) => (
      <div className="flex gap-5 items-center">
        <img
          src={row.original.image}
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
        ${row.original.price.toFixed(2)}
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
            <Link to={`/product/${product.id}`}>View Product</Link>
          </Button>
          {/* <ProductModal
            postId={product.id}
            userId={product.userId}
            post={product}
            type="delete"
          /> */}
          <Button
            variant="ghost"
            className={`capitalize cursor-pointer text-red-600 hover:text-red-600`}
          >
            <Trash2Icon className="w-5 h-5" />
            Remove
          </Button>
        </div>
      );
    },
  },
];
