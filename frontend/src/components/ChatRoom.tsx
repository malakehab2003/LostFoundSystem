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

const ChatRoom = ({ chatId }: { chatId: number }) => {
  const { messages, isLoading } = useGetMessages(chatId);
  const { createMessage, isPending } = useCreateMessage();
  const form = useForm<MessageFormSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: MessageFormSchema) => {
    createMessage({
      content: data.message,
      chatId,
    });

    form.reset();
  };
  console.log(messages);
  return (
    <div className="flex-1 flex flex-col gap-5 px-5 py-4">
      <header className="sub-header py-4 border-b border-slate-200">
        Chat with Haitham B.
      </header>

      <div className=" border-b border-slate-100 flex items-center space-x-2">
        <img
          alt="Reported Golden Retriever"
          className="w-16 h-16 rounded-lg object-cover border border-slate-200 shadow-sm"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPmh9vMiqDqPVkhMaiBN3AOAGapplXpgLVOcFp8iJpUzKxBI1JA9UA58K83HiNZRjdSrgA22lgLnB4q4GeHgIeyyyNPojSthksX4ped19hB2FE6cLmA4NaS9oKH9VEOipYA_crgejpXcZmBSZH6PmCC9bkOgWzUZx-d9vFCOJ_btT8NIlxFft4c7ep5MJeDOH-dgUNCqr3ofROMPnGKmJyPw0me5IGd8oAk6sCK2GUXZzSJaV0P207NRHC4dS7N_x1qHNmoOhHGhk"
        />
        <span className="font-semibold text-foreground-800">Reported item</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 space-y-6 custom-scrollbar">
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
      </div>

      <div className="max-w-2xl px-2 py-2 border-t border-slate-100 flex max-md:flex-col items-end justify-between gap-3 flex-wrap">
        <form
          id="message"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 "
        >
          <FieldGroup className="flex-1">
            <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    placeholder="Write a message..."
                    disabled={isPending}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <Button
          type="submit"
          form="message"
          disabled={isPending}
          className="min-w-5"
        >
          {isPending ? <Spinner /> : "Send Message"}
        </Button>
      </div>
    </div>
  );
};

export default ChatRoom;
