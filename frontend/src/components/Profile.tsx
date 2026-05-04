// Profile.tsx - Complete with user's items
import {
  MessageCircle,
  Mail,
  Phone,
  Calendar,
  Badge as BadgeIcon,
  User,
  Package,
  MapPin,
  CalendarDays,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { useGetAnotherUser } from "@/features/auth/hooks/useGetAnotherUser";
import { useGetUserItems } from "@/features/items/hooks/useGetUserItems";
import { Spinner } from "./ui/spinner";
import { useCreateChat } from "@/features/message/hooks/useCreateChat";

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { user, isLoading: userLoading } = useGetAnotherUser({
    id: Number(userId),
  });

  const { data: items = [], isLoading: itemsLoading } = useGetUserItems(
    Number(userId)
  );

  const userItems = items.filter(
    (item: any) => Number(item.user_id) === Number(userId)
  );

  const { createChat, isPending } = useCreateChat();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCreateChat = () => {
    if (!user) return;
    createChat(user.id);
    navigate("/dashboard/messages");
  };

  if (userLoading || itemsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <div className="flex justify-center sm:justify-start">
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                  <img
                    src={
                      user.image?.[0]?.image_url ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                    }
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                </div>
                <p className="text-slate-500">{user.email}</p>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleCreateChat}
                  disabled={isPending}
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  {isPending ? "Starting Chat..." : "Start Chat"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Contact Information
            </h2>

            <div className="space-y-5">
              <InfoItem
                icon={<Mail className="w-5 h-5" />}
                label="Email Address"
                value={user.email}
                link={`mailto:${user.email}`}
              />

              {user.show_phone_number && (
                <InfoItem
                  icon={<Phone className="w-5 h-5" />}
                  label="Phone Number"
                  value={user.phone}
                  link={`tel:${user.phone}`}
                />
              )}
            </div>
          </div>

          {/* Personal Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Personal Details
            </h2>

            <div className="space-y-5">
              <InfoItem
                icon={<Calendar className="w-5 h-5" />}
                label="Date of Birth"
                value={formatDate(user.dob)}
              />

              <InfoItem
                icon={<User className="w-5 h-5" />}
                label="Gender"
                value={user.gender}
              />

              <InfoItem
                icon={<BadgeIcon className="w-5 h-5" />}
                label="User Role"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              />
            </div>
          </div>
        </div>

        {/* User's Items Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            {user.name}'s Items ({userItems.length})
          </h2>

      {userItems.length === 0 ? (
          <div className="text-center py-10 border rounded-xl">
            <p>No items found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userItems.map((item: any) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:shadow-md"
                onClick={() => navigate(`/items/${item.id}`)}
              >
                <CardContent className="p-4">
                  <img
                    src={
                      item.image?.[0]?.url ||
                      "https://placehold.co/300x200"
                    }
                    className="w-full h-32 object-cover rounded-lg"
                  />

                  <h3 className="font-semibold mt-2">{item.title}</h3>

                  <div className="flex gap-2 mt-2">
                    <Badge
                      variant={
                        item.type === "lost" ? "destructive" : "default"
                      }
                    >
                      {item.type}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                    <MapPin className="w-3 h-3" />
                    {item.place}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>

        
      </div>
    </div>
  );
};

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: string;
}

const InfoItem = ({ icon, label, value, link }: InfoItemProps) => (
  <div className="flex gap-4 items-start">
    <div className="text-primary mt-1 flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      {link ? (
        <a
          href={link}
          className="text-slate-900 font-semibold text-base hover:text-primary transition-colors truncate block"
        >
          {value}
        </a>
      ) : (
        <p className="text-slate-900 font-semibold text-base capitalize">
          {value}
        </p>
      )}
    </div>
  </div>
);

export default Profile;