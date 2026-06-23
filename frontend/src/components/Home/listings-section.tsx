import React from "react";
import { Heart, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useListItems } from "@/features/items/hooks/useListItems";
import { Spinner } from "../ui/spinner";
import type { Item } from "@/features/items/itemsType";
import defaultpage from "@/assets/default-item-image.svg";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const LOST_FOUND_ITEMS: Item[] = [
  {
    id: 1,
    title: "Lost Wallet",
    description: "Black leather wallet with multiple cards and cash.",
    type: "lost",
    date: "2024-06-01T14:30:00Z",
    place: "Central Park, NYC",
    item_category_id: 1,
    city_id: 1,
    government_id: 1,
    user_id: 1,
    created_at: "2024-06-01T15:00:00Z",
    updated_at: "2024-06-01T15:00:00Z",
    category: { id: 1, name: "Accessories" },
    city: { id: 1, name: "New York" },
    government: { id: 1, name: "NY State" },
    user: { id: 1, name: "John Doe" },
    image: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      },
    ],
    comments: [
      { id: 1, content: "I think I found this wallet near the park entrance." },
    ],
  },
  {
    id: 2,
    title: "Found Keys",
    description: "Set of car keys with a red keychain.",
    type: "found",
    date: "2024-06-02T10:00:00Z",
    place: "Downtown Library, NYC",
    item_category_id: 2,
    city_id: 1,
    government_id: 1,
    user_id: 2,
    created_at: "2024-06-02T10:30:00Z",
    updated_at: "2024-06-02T10:30:00Z",
    category: { id: 2, name: "Keys" },
    city: { id: 1, name: "New York" },
    government: { id: 1, name: "NY State" },
    user: { id: 2, name: "Jane Smith" },
    image: [
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      },
    ],
    comments: [
      { id: 2, content: "I found these keys in the library parking lot." },
    ],
  },
  {
    id: 3,
    title: "Lost Dog",
    description: "Small brown dog with a blue collar, answers to 'Buddy'.",
    type: "lost",
    date: "2024-06-03T18:00:00Z",
    place: "Riverside Park, NYC",
    item_category_id: 3,
    city_id: 1,
    government_id: 1,
    user_id: 1,
    created_at: "2024-06-03T18:00:00Z",
    updated_at: "2024-06-03T18:00:00Z",
    category: { id: 3, name: "Animals" },
    city: { id: 1, name: "New York" },
    government: { id: 1, name: "NY State" },
    user: { id: 1, name: "John Doe" },
    image: [
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      },
    ],
    comments: [{ id: 3, content: "I saw this dog near the river." }],
  },
];

// --- Sub-components ---

const Badge = ({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "success" | "destructive" | "accent";
}) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-border text-foreground hover:bg-accent",
    success: "bg-green-500 text-white hover:bg-green-600 border-transparent",
    destructive: "bg-red-500 text-white hover:bg-red-600 border-transparent",
    accent: "bg-accent text-accent-foreground border-transparent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-colors",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};
const ItemCard = ({ item }: { item: Item }) => {
  return (
    <article className="group rounded-xl bg-card border border-border overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 bg-secondary overflow-hidden">
        <img
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={item.image?.[0]?.url || defaultpage}
        />

        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant={item.type === "lost" ? "destructive" : "success"}>
            {item.type === "lost" ? "Lost" : "Found"}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2 leading-tight">
            {item.title}
          </h3>

          <Badge variant="outline" className="text-xs">
            {item.category.name}
          </Badge>
        </div>

        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">
              {item.city?.name}, {item.government?.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{item.created_at}</span>
          </div>
        </div>

        {/* <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]">
          View Details
        </button> */}
        <Button
          asChild
          size={"lg"}
          variant={"default"}
          className="mx-auto w-full"
        >
          <Link to={`items/${item.id}`}>View Details</Link>
        </Button>
      </div>
    </article>
  );
};

export const ListingsSection: React.FC = () => {
  const { items, isLoading } = useListItems({
    limit: 6,
    type: "found",
  });
  const itemsToDisplay =
    items.length > 0 ? items.slice(0, 6) : LOST_FOUND_ITEMS;
  return (
    <div className="w-full p-4 md:p-8 bg-secondary rounded-lg">
      <div className="max-w-7xl mx-auto ">
        <header className="mb-8 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground/90">
            Community Lost & Found
          </h1>
          <p className="text-muted-foreground">
            Recent reports from your area. Helping items find their way home.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="text-center justify-center items-center py-12">
              <Spinner className="w-8 h-8 place-self-center text-primary" />
            </div>
          ) : (
            itemsToDisplay.map((item: Item) => (
              <ItemCard key={item.id} item={item} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
