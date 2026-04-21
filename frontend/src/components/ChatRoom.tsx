import { useGetMessages } from "@/features/message/hooks/useGetMessages";
import { useCreateMessage } from "@/features/message/hooks/useCreateMessage";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect, useRef } from "react";
import { Send, Check, CheckCheck } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Spinner } from "./ui/spinner";

interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  sender: {
    id: number;
    name: string;
  };
}

interface OtherUser {
  id: number;
  name: string;
  image_url?: string;
}

const ChatRoom = ({
  chatId,
  otherUser,
}: {
  chatId: number;
  otherUser: OtherUser;
}) => {
  const { messages, isLoading } = useGetMessages(chatId);
  const { sendMessage, isPending } = useCreateMessage();
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useCurrentUser();
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!content.trim()) return;
    sendMessage(
      { content, chat_id: chatId },
      {
        onSuccess: () => {
          setContent("");
        },
      },
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-slate-200 flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
          {otherUser.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-foreground/80">{otherUser.name}</h3>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Spinner className="w-8 h-8 place-self-center text-primary" />
              Loading messages...
            </div>
          </div>
        ) : messages && messages.length > 0 ? (
          <>
            {messages.map((msg: Message) => {
              const isSent = msg.sender_id === user.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isSent ? "justify-end" : "justify-start"}`}
                >
                  {/* Received Message */}
                  {!isSent && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-100 rounded-full flex items-center justify-center text-xs font-semibold text-slate-600">
                        {msg.sender.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`max-w-xs lg:max-w-md`}>
                    <div
                      className={`px-4 py-2 rounded-2xl transition-colors ${
                        isSent
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-slate-100 text-slate-900 rounded-bl-none"
                      }`}
                    >
                      <p className="break-words">{msg.content}</p>
                    </div>
                    <div
                      className={`flex items-center gap-1 mt-1 text-xs ${
                        isSent ? "justify-end" : "justify-start"
                      } text-slate-500`}
                    >
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isSent && (
                        <>
                          {msg.is_read ? (
                            <CheckCheck className="w-4 h-4" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-semibold text-slate-400">
                  {otherUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-lg font-semibold text-slate-900 mb-1">
                {otherUser.name}
              </p>
              <p className="text-sm text-foreground/60">
                No messages yet. Start the conversation!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Message Input Area */}
      <div className="p-4 border-t border-slate-200 flex-shrink-0 bg-slate-50">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={isPending}
              className="resize-none py-2 px-4 text-base"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={isPending || !content.trim()}
            size="icon"
            className="bg-primary hover:bg-primary/90 text-white rounded-full h-10 w-10 flex-shrink-0"
          >
            {isPending ? (
              <Spinner className="w-5 h-5 place-self-center text-primary" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
