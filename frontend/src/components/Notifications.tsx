import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetNotifications } from "@/features/notifications/hooks/useGetNotifications";
import { BellRing } from "lucide-react";
import { Spinner } from "./ui/spinner";

// let notifications = [
//   {
//     id: 14,
//     description: "this notification for you",
//     is_read: false,
//     message: "warning",
//     created_at: "2026-02-12T00:06:25.000Z",
//     updated_at: "2026-02-12T00:06:25.000Z",
//     user_id: 59,
//   },
//   {
//     id: 15,
//     description: "this notification for you",
//     is_read: false,
//     message: "warning",
//     created_at: "2026-02-12T00:06:25.000Z",
//     updated_at: "2026-02-12T00:06:25.000Z",
//     user_id: 59,
//   },
//   {
//     id: 16,
//     description: "this notification for you",
//     is_read: true,
//     message: "warning",
//     created_at: "2026-02-12T00:06:25.000Z",
//     updated_at: "2026-02-12T00:06:25.000Z",
//     user_id: 59,
//   },
// ];

const Notifications = () => {
  const { notifications, isLoading } = useGetNotifications();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <BellRing className="w-5 h-5 cursor-pointer " />
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
          ) : notifications.length === 0 ? (
            <p className="text-sm text-foreground-500 text-center py-10">
              No notifications yet. Check back later!
            </p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 flex flex-col gap-2 ${
                  !notif.is_read ? "bg-slate-50" : ""
                }`}
              >
                <div className="flex items-center justify-between px-2">
                  <span className="font-semibold text-foreground-900 text-sm capitalize tracking-wide ">
                    {notif.message}
                  </span>

                  {!notif.is_read && (
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

                  {/* {!notif.is_read && (
                    <button
                      className="text-xs text-blue-600 hover:underline self-start"
                      onClick={() => {
                      }}
                    >
                      Mark as read
                    </button>
                  )} */}
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
