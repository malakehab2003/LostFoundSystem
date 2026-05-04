// AdminUsers.tsx
import { useGetUsers } from "@/features/auth/hooks/useGetUsers";
import { useGetItems } from "@/features/items/hooks/useGetItems";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Trash2, User, ChevronDown, Shield, Eye } from "lucide-react";
import { useState } from "react";
import type { Item } from "@/features/items/itemsType";
import defaultpage from "@/assets/default-profile.webp";
import { useDeleteUser } from "@/features/auth/hooks/useDeleteUser";
import { useNavigate } from "react-router-dom";

type UserType = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

const AdminUsers = () => {
  const navigate = useNavigate();
  const { users, isLoading: usersLoading } = useGetUsers();
  const { items, isLoading: itemsLoading } = useGetItems();

  const [adminSearch, setAdminSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [openUserId, setOpenUserId] = useState<number | null>(null);

  const toggleUser = (id: number) => {
    setOpenUserId((prev) => (prev === id ? null : id));
  };

  const filteredAdmins =
    users?.filter(
      (user: UserType) =>
        user.role === "admin" &&
        (user.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(adminSearch.toLowerCase()))
    ) || [];

  const filteredUsers =
    users?.filter(
      (user: UserType) =>
        user.role !== "admin" &&
        (user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearch.toLowerCase()))
    ) || [];

  const getItemsForUser = (userId: number): Item[] => {
    if (!items) return [];

    return items.filter(
      (item: any) =>
        item.userId === userId || 
        item.user?.id === userId  
    );
  };

  const isLoading = usersLoading || itemsLoading;

  const renderUsersList = (
    usersList: UserType[],
    isAdmin: boolean,
    searchValue: string,
    setSearchValue: (val: string) => void
  ) => {
    return (
      <div className="space-y-4">
        <div className="mb-6">
          <input
            type="text"
            placeholder={`Search ${isAdmin ? "admins" : "users"}...`}
            className="w-full border rounded-lg px-4 py-2"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {usersList.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No users found
          </p>
        ) : (
          usersList.map((user: UserType) => {
            const userItems = getItemsForUser(user.id);
            return (
              <div
                key={user.id}
                className="border rounded-xl p-4 shadow-sm bg-white"
              >
                {/* Header */}
                <div
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 cursor-pointer"
                  onClick={() => toggleUser(user.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        isAdmin ? "bg-purple-100" : "bg-primary/10"
                      }`}
                    >
                      {isAdmin ? (
                        <Shield className="w-5 h-5 text-purple-600" />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>

                    <div>
                      <h2 className="font-semibold text-lg">
                        {user.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-auto sm:ml-0">
                    {/* ✅ زر عرض الملف الشخصي */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${user.id}`);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      View Profile
                    </Button>

                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        openUserId === user.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Items Section */}
                {openUserId === user.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="font-semibold text-sm text-gray-700 mb-3">
                      Items by {user.name}
                    </h3>
                    {userItems.length === 0 ? (
                      <p className="text-sm text-gray-500">No items found.</p>
                    ) : (
                      <div className="grid gap-3">
                        {userItems.slice(0, 5).map((item: any) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/items/${item.id}`);
                            }}
                          >
                            <img
                              src={item.image?.[0]?.url || defaultpage}
                              alt={item.title}
                              className="w-12 h-12 rounded-md object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.type} • {item.status}
                              </p>
                            </div>
                          </div>
                        ))}
                        {userItems.length > 5 && (
                          <Button
                            variant="link"
                            size="sm"
                            className="text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/items?userId=${user.id}`);
                            }}
                          >
                            View all {userItems.length} items →
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-10">
        Admin Panel - User Management
      </h1>

      {isLoading ? (
        <div className="text-center py-20">
          <Spinner className="w-8 h-8 mx-auto text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admins */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-purple-600">
              Admins ({filteredAdmins.length})
            </h2>

            {renderUsersList(
              filteredAdmins,
              true,
              adminSearch,
              setAdminSearch
            )}
          </div>

          {/* Users */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-primary">
              Users ({filteredUsers.length})
            </h2>

            {renderUsersList(
              filteredUsers,
              false,
              userSearch,
              setUserSearch
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;