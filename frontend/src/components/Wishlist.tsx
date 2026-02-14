import React from "react";
import { DataTable } from "./table/DataTable";
import { columns, products } from "./table/WishListColumns";

const Wishlist = () => {
  return (
    <div className="z-10 overflow-hidden max-w-6xl mx-auto flex flex-col  min-h-screen p-8 md:p-12 ">
      <div className="flex flex-col items-center justify-center gap-5 py-2 px-2 max-w-xl  text-center mx-auto my-10">
        <span className="header">My Wishlist </span>
        <span className="text-gray-500 text-sm">
          Save items you love and create collections for future inspiration.
          Discover new arrivals and explore curated edits to find your perfect
          pieces.
        </span>
        {/* <span className="text-gray-800 text-lg">{products.length} items</span> */}
      </div>
      <DataTable columns={columns} data={products} />
    </div>
  );
};

export default Wishlist;
