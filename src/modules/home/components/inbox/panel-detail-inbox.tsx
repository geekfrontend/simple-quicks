"use client";

import { ArrowLeft, X, EllipsisIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/customs/spinner";
import { cn } from "@/lib/utils";
import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_MESSAGES, SEND_MESSAGE } from "@/graphql/messages";
import { getRandomColor } from "@/utils";

type Message = {
  id: string;
  sender: string;
  text: string;
  time: string;
  date: string;
  isNew?: boolean;
};

type GetMessagesResult = {
  messages: Message[];
};

function Header({
  subject,
  isGroup,
  onBack,
}: {
  subject: string;
  isGroup: boolean;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center h-full max-h-[60px] justify-between px-4 py-2 border-b border-[#BDBDBD]">
      <div
        className="flex items-center gap-2 text-sm font-medium cursor-pointer"
        onClick={onBack}
      >
        <ArrowLeft size={18} className="text-[#333] dark:text-white" />
        <div className="flex flex-col">
          <span className="text-[#2F80ED] font-bold">{subject}</span>
          {isGroup && (
            <span className="text-[#333] text-xs">3 Participants</span>
          )}
        </div>
      </div>
      <X
        size={18}
        className="cursor-pointer text-[#828282] dark:text-white"
        onClick={onBack}
      />
    </div>
  );
}

function ChatActions({
  isYou,
  onReply,
}: {
  isYou: boolean;
  onReply: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full shadow-none"
          aria-label="Open edit menu"
        >
          <EllipsisIcon size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isYou ? (
          <>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem className="text-[#2F80ED] hover:opacity-80 cursor-pointer">
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[#2F80ED] hover:opacity-80 cursor-pointer"
              onClick={onReply}
            >
              Reply
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DateSeparator({ date }: { date: string }) {
  return (
    <div className="text-center text-xs text-gray-500 my-2">Today {date}</div>
  );
}

export function NewMessageSeparator() {
  return (
    <div className="text-center text-xs text-red-500 my-2 font-medium">
      New Message
    </div>
  );
}

function ChatBubble({
  sender,
  text,
  time,
  id,
  date,
  onReply,
}: Message & { onReply?: (msg: Message) => void }) {
  const isYou = sender === "Claren";
  const bubbleColor = useMemo(() => {
    if (isYou) return "bg-purple-200";

    const senderKey = `color-${sender}`;
    let stored = sessionStorage.getItem(senderKey);
    if (!stored) {
      stored = getRandomColor("bg-purple-200");
      sessionStorage.setItem(senderKey, stored);
    }
    return stored;
  }, [sender]);

  return (
    <div className={cn("my-2 flex", isYou ? "justify-end" : "justify-start")}>
      <div
        className={cn("flex items-center gap-2", !isYou && "flex-row-reverse")}
      >
        <div className="self-start">
          <ChatActions
            isYou={isYou}
            onReply={() => onReply?.({ sender, text, time, id, date })}
          />
        </div>
        <div className={cn("rounded-lg p-3", bubbleColor || "bg-gray-100")}>
          <p className="text-sm whitespace-pre-wrap text-gray-500">{text}</p>
          <p className="text-xs text-right text-gray-500 mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
}

function ChatList({
  messages,
  hasUnread,
  onReply,
}: {
  messages: Message[];
  hasUnread: boolean;
  onReply: (msg: Message) => void;
}) {
  let lastDate = "";
  let hasShownNew = false;

  return (
    <>
      {messages.map((msg) => {
        const showDate = msg.date !== lastDate ? msg.date : null;
        lastDate = msg.date;

        return (
          <div key={msg.id}>
            {showDate && <DateSeparator date={msg.date} />}
            {!hasShownNew && msg.isNew && hasUnread && <NewMessageSeparator />}
            <ChatBubble {...msg} onReply={onReply} />
            {msg.isNew && (hasShownNew = true)}
          </div>
        );
      })}
    </>
  );
}

function InputBar({
  onSend,
  message,
  setMessage,
}: {
  onSend: () => void;
  message: string;
  setMessage: (val: string) => void;
}) {
  return (
    <div className="flex items-center px-4 py-2 gap-2 bg-card">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a new message"
      />
      <Button
        onClick={onSend}
        disabled={!message.trim()}
        className="bg-blue-600 text-white text-sm font-medium px-4 py-2 cursor-pointer dark:bg-blue-600 hover:bg-blue-600 hover:opacity-80"
      >
        Send
      </Button>
    </div>
  );
}

export default function PanelDetailInbox({
  chatId,
  isGroup = true,
  onBack,
  subject,
}: {
  chatId: string;
  isGroup?: boolean;
  onBack: () => void;
  subject: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [hasUnread, setHasUnread] = useState(true);
  const [message, setMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  const { data, loading } = useQuery(GET_MESSAGES, {
    variables: { chatId },
    pollInterval: 1500,
  });

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    update(cache, { data }) {
      if (!data?.sendMessage) return;

      const newMessage = data.sendMessage;

      const existing = cache.readQuery<GetMessagesResult>({
        query: GET_MESSAGES,
        variables: { chatId },
      });

      if (!existing) return;

      cache.writeQuery<GetMessagesResult>({
        query: GET_MESSAGES,
        variables: { chatId },
        data: {
          messages: [...existing.messages, newMessage],
        },
      });
    },
  });

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setHasUnread(false);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    await sendMessage({
      variables: {
        chatId,
        sender: "Claren",
        text: message,
        replyToId: replyingTo?.id,
      },
    });

    setMessage("");
    setReplyingTo(null);
    setTimeout(scrollToBottom, 100);
  };

  const messages: Message[] = data?.messages ?? [];

  return (
    <div className="fixed bottom-[100px] right-6 z-50 w-full max-w-[734px] h-[737px] rounded-sm bg-card border border-[#828282] flex flex-col overflow-hidden">
      <Header isGroup={isGroup} onBack={onBack} subject={subject} />
      <div className="flex-1 overflow-y-auto px-4 py-2 text-sm">
        {loading ? (
          <Spinner className="text-[#C4C4C4]">Loading Chats...</Spinner>
        ) : (
          <>
            <ChatList
              messages={messages}
              hasUnread={hasUnread}
              onReply={(msg) => setReplyingTo(msg)}
            />
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {!isGroup && (
        <div className="flex mx-4 bg-[#E9F3FF] items-center gap-2 p-2.5 rounded-md">
          <Spinner className="text-[#2F80ED]" />
          <span className="text-[#4F4F4F] font-bold text-sm">
            Please wait while we connect you with one of our team...
          </span>
        </div>
      )}

      {hasUnread && (
        <div className="flex justify-center">
          <Button
            onClick={scrollToBottom}
            className="w-max my-1 bg-[#E9F3FF] text-[#2F80ED] font-bold hover:opacity-80 dark:bg-[#E9F3FF] hover:bg-[#E9F3FF] cursor-pointer"
          >
            New Message
          </Button>
        </div>
      )}

      {/* Reply Preview */}
      {replyingTo && (
        <div className="mx-4 bg-[#F2F2F2] p-2 rounded flex justify-between items-start text-sm">
          <div>
            <p className="text-[#4F4F4F] font-semibold">
              Reply to {replyingTo.sender}
            </p>
            <p className="text-[#4F4F4F]">{replyingTo.text}</p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="ml-2 text-gray-500 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <InputBar onSend={handleSend} message={message} setMessage={setMessage} />
    </div>
  );
}
