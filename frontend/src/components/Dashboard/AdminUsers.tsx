import { useGetUsers } from "@/features/auth/hooks/useGetUsers";
import { useGetItems } from "@/features/items/hooks/useGetItems";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { User, ChevronDown, Shield, Eye } from "lucide-react";
import { useState } from "react";
import type { Item } from "@/features/items/itemsType";
import defaultpage from "@/assets/default-profile.webp";
import { useNavigate } from "react-router-dom";
import { useMakeAdmin } from "@/features/auth/hooks/useMakeAdmin";

type UserType = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

const AdminUsers = () => {
  const navigate = useNavigate();
  const { makeAdmin, isPending } = useMakeAdmin();
  const { users, isLoading: usersLoading } = useGetUsers();
  const { items, isLoading: itemsLoading } = useGetItems();

  const [adminSearch, setAdminSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [openUserId, setOpenUserId] = useState<number | null>(null);

  let [filteredUsers, setFilteredUsers] = useState([]);
  let [filteredAdmins, setFilteredAdmins] = useState([]);

  const toggleUser = (id: number) => {
    setOpenUserId((prev) => (prev === id ? null : id));
  };

  filteredAdmins =
    users?.filter(
      (user: UserType) =>
        user.role === "admin" &&
        (user.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(adminSearch.toLowerCase())),
    ) || [];

  filteredUsers =
    users?.filter(
      (user: UserType) =>
        user.role !== "admin" &&
        (user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearch.toLowerCase())),
    ) || [];

  const getItemsForUser = (userId: number): Item[] => {
    if (!items) return [];

    return items.filter(
      (item: any) => item.userId === userId || item.user?.id === userId,
    );
  };

  const isLoading = usersLoading || itemsLoading;

  const renderUsersList = (
    usersList: UserType[],
    isAdmin: boolean,
    searchValue: string,
    setSearchValue: (val: string) => void,
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
          <p className="text-center text-gray-500 py-10">No users found</p>
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
                      <h2 className="font-semibold text-lg">{user.name}</h2>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-auto sm:ml-0">
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
                    {!isAdmin && (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          makeAdmin(user.id);

                          setFilteredAdmins(u => [...u, user]);

                          setFilteredUsers(prev =>
                            prev.filter(u => u.id !== user.id)
                          );
                        }}
                      >
                        Make Admin
                      </Button>
                    )}
                  </div>
                </div>
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

            {renderUsersList(filteredAdmins, true, adminSearch, setAdminSearch)}
          </div>

          {/* Users */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-primary">
              Users ({filteredUsers.length})
            </h2>

            {renderUsersList(filteredUsers, false, userSearch, setUserSearch)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
