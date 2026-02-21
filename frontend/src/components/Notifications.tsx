import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BellRing } from "lucide-react";

let notifications = [
  {
    id: 14,
    description: "this notification for you",
    is_read: false,
    message: "warning",
    created_at: "2026-02-12T00:06:25.000Z",
    updated_at: "2026-02-12T00:06:25.000Z",
    user_id: 59,
  },
  {
    id: 15,
    description: "this notification for you",
    is_read: false,
    message: "warning",
    created_at: "2026-02-12T00:06:25.000Z",
    updated_at: "2026-02-12T00:06:25.000Z",
    user_id: 59,
  },
  {
    id: 16,
    description: "this notification for you",
    is_read: true,
    message: "warning",
    created_at: "2026-02-12T00:06:25.000Z",
    updated_at: "2026-02-12T00:06:25.000Z",
    user_id: 59,
  },
];

const Notifications = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <BellRing className="w-5 h-5 cursor-pointer hover:text-primary" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Keep an eye out here for new notifications!
          </SheetDescription>
        </SheetHeader>
        <div className=" flex flex-col divide-y divide-gray-200">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-10">
              No notifications yet
            </p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 flex flex-col gap-2 ${
                  !notif.is_read ? "bg-slate-50" : ""
                }`}
              >
                {/* top row */}
                <div className="flex items-center justify-between px-2">
                  <span className="font-semibold text-foreground-900 text-sm capitalize tracking-wide ">
                    {notif.message} 
                  </span>

                  {!notif.is_read && (
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                  )}
                </div>

                {/* description */}
                <p className="text-sm text-foreground-800 px-2">
                  {notif.description}this is a notification for you this is a
                    notification for you this is a notification for you
                </p>

                {/* date */}
                <span className="text-xs text-gray-400">
                  {new Date(notif.created_at).toLocaleString()}
                </span>

                {/* mark as read button */}
                {!notif.is_read && (
                  <button
                    className="text-xs text-blue-600 mt-1 hover:underline self-start"
                    onClick={() => {
                      console.log("mark as read", notif.id);
                      // later connect API here
                    }}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Notifications;
