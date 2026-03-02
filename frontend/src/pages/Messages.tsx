import { Input } from "@/components/ui/input";
import React from "react";

const inboxMessages = [
  {
    id: 1,
    sender: "Haitham B.",
    senderInitials: "HB",
    messageDate: "Today at 2:09 PM",
    messageText:
      "Thank you so much for the update! I really appreciate your help in finding my lost dog. Your dedication and support mean a lot to me during this difficult time.",
  },
  {
    id: 2,
    sender: "Alexis S.",
    senderInitials: "AS",
    messageDate: "Yesterday at 5:45 PM",
    messageText:
      "Hi, I found your wallet near the park. I will keep it safe until we can arrange a time for you to pick it up.",
  },
];
const Messages = () => {
  return (
    <main className="flex-1 flex overflow-hidden pt-10 px-8">
      <aside className="w-80 flex flex-col border-r border-slate-200">
        <h2 className="header self-start px-3 py-5">Inbox</h2>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {inboxMessages.map((message) => (
            <div
              className="px-3 py-4 flex items-center space-x-4 cursor-pointer hover:bg-slate-50 transition-all"
              key={message.id}
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">
                  {message.senderInitials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-semibold text-slate-800 truncate">
                    {message.sender}
                  </span>
                  {/*  Date */}
                  <span className="text-xs text-slate-500">
                    {message.messageDate}
                  </span>
                </div>
                <p className="text-sm text-slate-500 truncate">
                  {message.messageText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-[#002D5B]">
            Chat with Haitham B.
          </h2>
        </header>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center space-x-4">
          <img
            alt="Reported Golden Retriever"
            className="w-16 h-16 rounded-lg object-cover border border-slate-200 shadow-sm"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPmh9vMiqDqPVkhMaiBN3AOAGapplXpgLVOcFp8iJpUzKxBI1JA9UA58K83HiNZRjdSrgA22lgLnB4q4GeHgIeyyyNPojSthksX4ped19hB2FE6cLmA4NaS9oKH9VEOipYA_crgejpXcZmBSZH6PmCC9bkOgWzUZx-d9vFCOJ_btT8NIlxFft4c7ep5MJeDOH-dgUNCqr3ofROMPnGKmJyPw0me5IGd8oAk6sCK2GUXZzSJaV0P207NRHC4dS7N_x1qHNmoOhHGhk"
          />
          <span className="font-semibold text-foreground-800">
            Reported item
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">HB</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-foreground-800">
                  Haitham B.
                </span>
                <span className="text-xs text-slate-500">Today at 2:09 PM</span>
              </div>
              <p className="text-slate-700">Hey</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">HB</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-foreground-800">
                  Haitham B.
                </span>
                <span className="text-xs text-slate-500">Today at 2:12 PM</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                Please ignore this message
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl px-12 py-8 border-t border-slate-100">
          <Input
            className=" px-6 py-6 border border-slate-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
            placeholder="Write a message"
          />
        </div>
      </div>
    </main>
  );
};

export default Messages;
