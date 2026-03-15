import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { DataTable } from "./table/DataTable";
import { columns } from "./table/WishListColumns";
import { Spinner } from "./ui/spinner";

const Wishlist = () => {
  const { wishlist, isLoading } = useWishlist();
  console.log(wishlist);
  return (
    <div className="max-w-4xl mx-auto flex flex-col">
      <div className="flex flex-col items-center justify-center gap-5 max-w-xl text-center mx-auto my-10">
        <span className="header">My Wishlist </span>
        <span className="text-foreground/70 tracking-tight text-sm">
          Save items you love and create collections for future inspiration.
          Discover new arrivals and explore curated edits to find your perfect
          pieces.
        </span>
      </div>
      {isLoading ? (
        <div className="text-center justify-center items-center content-center h-full">
          <Spinner className="w-8 h-8 place-self-center text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={wishlist} />
      )}
    </div>
  );
};

export default Wishlist;
