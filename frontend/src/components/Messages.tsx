import { useGetChats } from "@/features/message/hooks/useGetChats";
import ChatRoom from "./ChatRoom";
import { useState, useEffect } from "react";
import { MessageSquare, Search, ChevronRight, ChevronLeft } from "lucide-react";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";

interface Chat {
  chat_id: number;
  other_user: {
    id: number;
    name: string;
    image_url?: string;
  };
  last_message: string | null;
  unread: number;
}

const Messages = () => {
  const { chats, isLoading } = useGetChats();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  const selectedChatId = searchParams.get("chatId")
    ? Number(searchParams.get("chatId"))
    : null;

  useEffect(() => {
    if (!selectedChatId && chats && chats.length > 0 && !isLoading) {
      setSearchParams({ chatId: String(chats[0].chat_id) });
    }
  }, [chats, selectedChatId, isLoading, setSearchParams]);

  // Show chat on mobile when a chat is selected
  useEffect(() => {
    if (selectedChatId) {
      setShowChatOnMobile(true);
    }
  }, [selectedChatId]);

  const filteredChats =
    chats?.filter((chat) =>
      chat.other_user.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const selectedChat = chats?.find((chat) => chat.chat_id === selectedChatId);

  const handleSelectChat = (chatId: number) => {
    setSearchParams({ chatId: String(chatId) });
  };

  const handleBackToList = () => {
    setShowChatOnMobile(false);
  };

  return (
    <div className="flex overflow-hidden h-[calc(100vh-80px)]">
      {/* Chat List Sidebar - Hidden on mobile when chat is selected */}
      <aside
        className={`w-full md:w-80 flex flex-col border-r border-slate-200 overflow-hidden transition-all duration-300 ${
          showChatOnMobile ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-slate-200 flex-shrink-0">
          <h2 className="sub-header mb-4 flex items-center gap-2  text-foreground/80">
            <MessageSquare className="w-5 h-5" />
            Messages
          </h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <Input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2 text-sm"
            />
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center justify-center items-center content-center h-full">
                <Spinner className="w-8 h-8 place-self-center text-primary" />{" "}
                Loading chats...
              </div>
            </div>
          ) : filteredChats && filteredChats.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredChats.map((chat: Chat) => {
                const isSelected = selectedChatId === chat.chat_id;
                const isUnread = chat.unread > 0;

                return (
                  <button
                    key={chat.chat_id}
                    onClick={() => handleSelectChat(chat.chat_id)}
                    className={`w-full p-4 text-left transition-colors duration-200 hover:bg-slate-50 ${
                      isSelected ? "bg-primary/5 border-slate-200" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center text-lg font-semibold text-primary">
                          {chat.other_user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3
                            className={`font-semibold text-foreground/80 truncate ${
                              isUnread ? "font-bold" : ""
                            }`}
                          >
                            {chat.other_user.name}
                          </h3>
                          {isUnread && (
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-primary rounded-full">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm truncate ${
                            isUnread
                              ? "text-foreground/80 font-medium"
                              : "text-foreground/60"
                          }`}
                        >
                          {chat.last_message || "No messages yet"}
                        </p>
                      </div>

                      {isSelected && (
                        <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center px-4">
                <MessageSquare className="w-12 h-12 text-foreground/20 mx-auto mb-2" />
                <p className="text-foreground/60 font-medium">No chats found</p>
                <p className="text-sm text-foreground/40">
                  {searchTerm
                    ? "Try a different search"
                    : "Start a conversation"}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Chat Room - Full screen on mobile, sidebar on desktop */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          showChatOnMobile ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedChat ? (
          <>
            {/* Mobile Back Button */}
            <div className="md:hidden flex items-center gap-3 p-4 border-b border-slate-200 bg-slate-50">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToList}
                className="h-8 w-8"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="text-sm font-medium text-foreground/80">
                {selectedChat.other_user.name}
              </span>
            </div>
            <ChatRoom
              chatId={selectedChatId!}
              otherUserId={selectedChat.other_user.id}
            />
          </>
        ) : (
          <div className="hidden md:flex items-center justify-center h-full flex-1">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
              <p className="text-xl font-semibold text-foreground/60 mb-2">
                Select a chat
              </p>
              <p className="text-foreground/40">
                Choose a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
