import { useCreateChat } from "@/features/message/hooks/useCreateChat";
import { useGetChats } from "@/features/message/hooks/useGetChats";
import ChatRoom from "./ChatRoom";

const Messages = () => {
  const { chats } = useGetChats();
  console.log("all chats", chats);
  const { createChat } = useCreateChat();

  return (
    <main className="flex-1 flex overflow-hidden pt-10 px-8">
      <aside className="w-80 flex flex-col border-r border-slate-200">
        <h2 className="header self-start px-3 py-5">Inbox</h2>
        <div className="flex-1 overflow-y-auto custom-scrollbar"></div>
        <button
          onClick={() => {
            console.log("clicker");
            createChat(53);
          }}
        >
          click me
        </button>
      </aside>

      <ChatRoom chatId={1} />
    </main>
  );
};

export default Messages;
