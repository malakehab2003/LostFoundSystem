import { Controller, useForm } from "react-hook-form";
import { Field, FieldGroup } from "./ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  messageSchema,
  type MessageFormSchema,
} from "@/features/message/messageType";
import { useGetMessages } from "@/features/message/hooks/useGetMessages";
import { useCreateMessage } from "@/features/message/hooks/useCreateMessage";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Input } from "./ui/input";
import { useState } from "react";

const ChatRoom = ({ chatId }: { chatId: number }) => {
  const { messages, isLoading } = useGetMessages(chatId);
  const { sendMessage, isPending } = useCreateMessage();
  const [content, setContent] = useState("");

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

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <p>Loading messages...</p>
        ) : (
          messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id === msg.sender_id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender_id === msg.sender_id
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p>{msg.content}</p>
                <span className="text-xs opacity-70">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={isPending}
          />
          <button
            onClick={handleSendMessage}
            disabled={isPending || !content.trim()}
            className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
