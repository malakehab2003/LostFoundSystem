import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetNotifications } from "@/features/notifications/hooks/useGetNotifications";
import { BellRing, Check } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCountNotifications } from "@/features/notifications/hooks/useCountNotifications";

const Notifications = () => {
  const { notifications, isLoading } = useGetNotifications();
  const { notificationsCount: unreadCount } = useCountNotifications();
  const navigate = useNavigate();
  const [openSheet, setOpenSheet] = useState(false);
  const handleNotificationClick = (notif: any) => {
    if (notif.entity && notif.entity_id) {
      if (notif.entity === "chat") {
        navigate(`/dashboard/messages?chatId=${notif.entity_id}`);
      }
      if (notif.entity === "item") {
        navigate(`/items/${notif.entity_id}`);
      }
      setOpenSheet(false);
    }
  };

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <div className="relative cursor-pointer">
          <BellRing className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {unreadCount}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Keep an eye out here for new notifications!
          </SheetDescription>
        </SheetHeader>
        <div className=" flex flex-col divide-y divide-gray-200">
          {isLoading ? (
            <div className="text-center py-20 justify-center items-center">
              <Spinner className="w-8 h-8 place-self-center text-primary" />
              <span className="text-sm text-foreground-500">Loading...</span>
            </div>
          ) : notifications?.length === 0 ? (
            <p className="text-sm text-foreground-500 text-center py-10">
              No notifications yet. Check back later!
            </p>
          ) : (
            notifications?.map((notif: any) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 flex flex-col gap-2 cursor-pointer transition-colors hover:bg-slate-100 ${
                  !notif.is_read ? "bg-slate-50" : ""
                }`}
              >
                <div className="flex items-center justify-between px-2">
                  <span className="font-semibold text-foreground-900 text-sm capitalize tracking-wide ">
                    {notif.message}
                  </span>

                  {notif.is_read ? (
                    <Check className="w-4 h-4 text-primary mr-2" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                  )}
                </div>

                <p className="text-sm text-foreground-800 px-2">
                  {notif.description}
                </p>

                <div className="flex justify-between items-center px-2 ">
                  <span className="text-xs text-foreground-400">
                    {new Date(notif.created_at).toLocaleString()}
                  </span>

                  {notif.entity && notif.entity_id && (
                    <span className="text-xs text-primary font-medium">
                      {notif.entity.charAt(0).toUpperCase() +
                        notif.entity.slice(1)}{" "}
                      #{notif.entity_id}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Notifications;
