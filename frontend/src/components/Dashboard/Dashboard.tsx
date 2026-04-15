import {
  MessageSquare,
  User,
  ChevronRight,
  AlertCircle,
  MapPin,
  ShoppingCartIcon,
  Plus,
  Shield,
} from "lucide-react";
import emptyItems from "@/assets/no-items.svg";
import { Link } from "react-router-dom";
import { useGetItems } from "@/features/items/hooks/useGetItems";
import { Spinner } from "@/components/ui/spinner";
import type { Item } from "@/features/items/itemsType";
import defaultpage from "@/assets/default-profile.webp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

const Dashboard = () => {
  // خد كل حاجة من useAuth
  const { user, token, isAdmin: isAdminFromAuth } = useAuth();
  
  // استخدم isAdmin من useGetItems أو useAuth
  const { items, isLoading, isAdmin: isAdminFromItems } = useGetItems();
  
  // استخدم isAdmin من AuthContext (الأفضل)
  const isAdmin = isAdminFromAuth || isAdminFromItems;

  // Console logs للـ debugging
  console.log("User object:", user);
  console.log("User role:", user?.role);
  console.log("Is Admin from Auth:", isAdminFromAuth);
  console.log("Is Admin from Items:", isAdminFromItems);
  
  // Check token payload
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Token payload:", payload);
      console.log("Role from token:", payload.role);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return (
    <div className="max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto">
      <div className="max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto relative">
        {/* Manage Users Button - Only for Admin */}
        <div className="flex justify-end mb-6 p-4 rounded">
          {!isAdmin && (
            <Link to="/dashboard/admin-users">
              <Button className="flex items-center gap-2 mr-4 bg-primary hover:bg-primary/90">
                <Shield className="w-4 h-4" />
                Manage Users
              </Button>
            </Link>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 mb-10">
          <h1 className="header text-center">Dashboard</h1>
          {/* Optional: Show admin badge */}
          {isAdmin && (
            <Badge variant="default" className="bg-primary">
              Admin Access
            </Badge>
          )}
        </div>

        <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16"></div>
      </div>

      <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sub-header">
              {isAdmin ? "All Items" : "Your Items"}
            </h2>
            <Button
              asChild
              className="group duration-200 border-2 rounded-full border-primary text-primary hover:text-white hover:bg-primary px-5 py-3 flex items-center gap-3"
              size={"lg"}
              variant={"outline"}
            >
              <Link to={"/dashboard/itemdialog"}>
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 text-primary group-hover:text-white" />
                Add an Item
              </Link>
            </Button>
          </div>

          <div className="space-y-6!">
            {isLoading ? (
              <div className="text-center py-20 justify-center items-center">
                <Spinner className="w-8 h-8 place-self-center text-primary" />
              </div>
            ) : items && items.length > 0 ? (
              items.map((item: Item) => (
                <Link
                  key={item.id}
                  to={`items/${item.id}`}
                  className="block group cursor-pointer rounded-lg border border-gray-200 bg-white py-4 px-2 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.images[0] || defaultpage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex justify-between gap-4">
                      <div className="flex flex-col gap-2 justify-between items-start">
                        <h3 className="capitalize text-lg sub-header group-hover:text-foreground-90 transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-foreground/80 capitalize text-semibold tracking-wide text-[12px] group-hover:text-foreground/90 transition-colors">
                          {item.type} Date: {item.date}
                        </p>
                        {item.images && item.images.length < 4 && (
                          <div className="flex items-center gap-1 text-foreground/80 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            <span className="text-xs font-medium">
                              Add photos to{" "}
                              <span className="font-semibold">{item.type}</span>{" "}
                              report
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-between gap-2 items-center">
                        <ChevronRight className="w-5 h-5 text-primary/80 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        <Badge variant={"secondary"} className="capitalize">
                          {item.type}
                        </Badge>
                        {!isAdmin && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              // Add delete logic here
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-foreground/80 text-lg font-semibold tracking-wide text-center py-20">
                No items to display. Start report an item!
                <img
                  src={emptyItems}
                  alt="No items"
                  className="mx-auto mt-6 rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <section>
            <h2 className="text-2xl sub-header mb-6">Inbox</h2>
            <Link
              to="/dashboard/messages"
              className="group w-full flex items-center justify-between gap-1 py-2 px-4 transition-all rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md"
            >
              <div className="p-2">
                <MessageSquare className="w-5 h-5 text-foreground/60 group-hover:text-primary" />
              </div>
              <span className="text-base font-semibold text-foreground/60 group-hover:text-primary">
                Messages
              </span>
              <span className="ml-auto bg-primary text-white text-xs font-black px-2 py-1 rounded-full">
                2
              </span>
            </Link>
          </section>

          {/* Account Settings Section */}
          <section>
            <h2 className="text-2xl sub-header mb-6">Account Settings</h2>
            <div className="flex flex-col gap-5">
              <Link
                to="/dashboard/info"
                className="group w-full flex items-center gap-1 py-2 px-4 transition-all rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md"
              >
                <div className="p-2">
                  <User className="w-5 h-5 text-foreground/60 group-hover:text-primary" />
                </div>
                <span className="text-base font-semibold text-foreground/60 group-hover:text-primary">
                  Personal Information
                </span>
              </Link>
              <Link
                to="/dashboard/address"
                className="group w-full flex items-center gap-1 py-2 px-4 transition-all rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md"
              >
                <div className="p-2">
                  <MapPin className="w-5 h-5 text-foreground/60 group-hover:text-primary" />
                </div>
                <span className="text-base font-semibold text-foreground/60 group-hover:text-primary">
                  My Addresses
                </span>
              </Link>
              <Link
                to="/dashboard/wishlist"
                className="group w-full flex items-center gap-1 py-2 px-4 transition-all rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md"
              >
                <div className="p-2">
                  <ShoppingCartIcon className="w-5 h-5 text-foreground/60 group-hover:text-primary" />
                </div>
                <span className="text-base font-semibold text-foreground/60 group-hover:text-primary">
                  My Wishlist
                </span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;