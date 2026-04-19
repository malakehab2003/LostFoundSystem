// import { useGetUsers } from "@/features/auth/hooks/useGetUsers";
// import { useGetItems } from "@/features/items/hooks/useGetItems";
// import { Spinner } from "@/components/ui/spinner";
// import { Button } from "@/components/ui/button";
// import { Trash2, User, ChevronDown, Shield } from "lucide-react";
// import { useState } from "react";
// import type { Item } from "@/features/items/itemsType";
// import defaultpage from "@/assets/default-profile.webp";
// import { useDeleteUser } from "@/features/auth/hooks/useDeleteUser";

// type UserType = {
//   id: number;
//   name: string;
//   email: string;
//   role?: string;
// };

// const AdminUsers = () => {
//   const { users, isLoading: usersLoading } = useGetUsers();
//   const { items, isLoading: itemsLoading } = useGetItems();

//   const [adminSearch, setAdminSearch] = useState("");
//   const [userSearch, setUserSearch] = useState("");

//   const { deleteUser } = useDeleteUser();

//   const [openUserId, setOpenUserId] = useState<number | null>(null);

//   const toggleUser = (id: number) => {
//     setOpenUserId((prev) => (prev === id ? null : id));
//   };

//   const filteredAdmins =
//     users?.filter(
//       (user: UserType) =>
//         user.role === "admin" &&
//         (user.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
//           user.email.toLowerCase().includes(adminSearch.toLowerCase()))
//     ) || [];

//   const filteredUsers =
//     users?.filter(
//       (user: UserType) =>
//         user.role !== "admin" &&
//         (user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
//           user.email.toLowerCase().includes(userSearch.toLowerCase()))
//     ) || [];

//   const getItemsForUser = (userId: number): Item[] => {
//     return items?.filter((item: Item) => item.userId === userId) || [];
//   };

//   const isLoading = usersLoading || itemsLoading;

//   // ✅ Render List
//   const renderUsersList = (
//     usersList: UserType[],
//     isAdmin: boolean,
//     searchValue: string,
//     setSearchValue: (val: string) => void
//   ) => {
//     return (
//       <div className="space-y-4">
//         <div className="mb-6">
//           <input
//             type="text"
//             placeholder={`Search ${isAdmin ? "admins" : "users"}...`}
//             className="w-full border rounded-lg px-4 py-2"
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//           />
//         </div>

//         {/* ❗ No Results */}
//         {usersList.length === 0 ? (
//           <p className="text-center text-gray-500 py-10">
//             {searchValue
//               ? `No results for "${searchValue}"`
//               : `No ${isAdmin ? "administrators" : "users"} found`}
//           </p>
//         ) : (
//           usersList.map((user: UserType) => {
//             const userItems = getItemsForUser(user.id);

//             return (
//               <div
//                 key={user.id}
//                 className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
//               >
//                 {/* Header */}
//                 <div
//                   className="flex justify-between items-center cursor-pointer"
//                   onClick={() => toggleUser(user.id)}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div
//                       className={`p-2 rounded-full ${
//                         isAdmin ? "bg-purple-100" : "bg-primary/10"
//                       }`}
//                     >
//                       {isAdmin ? (
//                         <Shield className="w-5 h-5 text-purple-600" />
//                       ) : (
//                         <User className="w-5 h-5 text-primary" />
//                       )}
//                     </div>

//                     <div>
//                       <div className="flex items-center gap-2">
//                         <h2 className="font-semibold text-lg">
//                           {user.name}
//                         </h2>
//                         {isAdmin && (
//                           <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
//                             Admin
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-sm text-gray-500">
//                         {user.email}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
//                       {userItems.length} items
//                     </span>
//                     <ChevronDown
//                       className={`w-5 h-5 transition-transform ${
//                         openUserId === user.id ? "rotate-180" : ""
//                       }`}
//                     />
//                   </div>
//                 </div>

//                 {/* Items */}
//                 {openUserId === user.id && (
//                   <div className="mt-5 space-y-3 border-t pt-4">
//                     {userItems.length > 0 ? (
//                       userItems.map((item: Item) => (
//                         <div
//                           key={item.id}
//                           className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50"
//                         >
//                           <div className="flex items-center gap-3">
//                             <img
//                               src={item.images?.[0] || defaultpage}
//                               className="w-12 h-12 rounded-md object-cover border"
//                               alt={item.title}
//                             />
//                             <div>
//                               <span className="font-medium block">
//                                 {item.title}
//                               </span>
//                               <span className="text-xs text-gray-500">
//                                 {item.type} • {item.date}
//                               </span>
//                             </div>
//                           </div>

//                           <Button
//                             size="sm"
//                             variant="destructive"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               console.log("delete item", item.id);
//                             }}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-sm text-gray-500 text-center py-4">
//                         No items for this user
//                       </p>
//                     )}

//                     {/* Delete User */}
//                     {!isAdmin && (
//                       <Button
//                         variant="destructive"
//                         className="w-full mt-3"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           deleteUser(user.id);
//                         }}
//                       >
//                         Delete User
//                       </Button>
//                     )}
//                     {!isAdmin && (
//                       <Button
//                         variant="destructive"
//                         className="w-full mt-3 bg-orange-600 hover:bg-orange-500"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           deleteUser(user.id);
//                         }}
//                       >
//                         Mark as Admin
//                       </Button>
//                     )}

//                   </div>

//                 )}
//               </div>

//             );
//           })
//         )}
//       </div>

//     );
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-center mb-10">
//         Admin Panel - User Management
//       </h1>

//       {isLoading ? (
//         <div className="text-center py-20">
//           <Spinner className="w-8 h-8 mx-auto text-primary" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Admins */}
//           <div className="bg-gray-50 rounded-xl p-6">
//             <div className="flex items-center gap-2 mb-6">
//               <Shield className="w-6 h-6 text-purple-600" />
//               <h2 className="text-2xl font-semibold text-purple-900">
//                 Administrators
//               </h2>
//               <span className="ml-auto bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
//                 {filteredAdmins.length}
//               </span>
//             </div>

//             {renderUsersList(
//               filteredAdmins,
//               true,
//               adminSearch,
//               setAdminSearch
//             )}
//           </div>

//           {/* Users */}
//           <div className="bg-gray-50 rounded-xl p-6">
//             <div className="flex items-center gap-2 mb-6">
//               <User className="w-6 h-6 text-primary" />
//               <h2 className="text-2xl font-semibold text-primary">
//                 Regular Users
//               </h2>
//               <span className="ml-auto bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
//                 {filteredUsers.length}
//               </span>
//             </div>

//             {renderUsersList(
//               filteredUsers,
//               false,
//               userSearch,
//               setUserSearch
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminUsers;

import React from "react";

const AdminUsers = () => {
  return <div>AdminUsers</div>;
};

export default AdminUsers;
