"use client";

import SearchInput from "@/components/ui/customs/input-search";
import { Spinner } from "@/components/ui/customs/spinner";
import { useState } from "react";
import PanelDetailInbox from "./panel-detail-inbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserRoundIcon } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_INBOX_LIST } from "@/graphql/inbox";

type InboxItemType = {
  id: string;
  subject: string;
  preview: string;
  sender: string;
  date: string;
  isUnread?: boolean;
  isGroup?: boolean;
};

function InboxAvatar({ isGroup }: { isGroup?: boolean }) {
  return (
    <div
      className={cn(
        "flex-shrink-0 relative w-10",
        !isGroup && "flex items-center justify-center"
      )}
    >
      {isGroup ? (
        <div className="flex -space-x-[0.9rem]">
          <Avatar className="w-[34px] h-[34px] border-2 border-white shadow-sm">
            <AvatarFallback>
              <UserRoundIcon size={16} className="opacity-60" />
            </AvatarFallback>
          </Avatar>
          <Avatar className="w-[34px] h-[34px] border-2 border-white shadow-sm">
            <AvatarFallback>
              <UserRoundIcon size={16} className="opacity-60" />
            </AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <Avatar className="w-[34px] h-[34px]">
          <AvatarFallback>
            <UserRoundIcon size={16} className="opacity-60" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

function InboxItem({
  data,
  onClick,
}: {
  data: InboxItemType;
  onClick: () => void;
}) {
  const { subject, preview, sender, date, isUnread, isGroup } = data;

  return (
    <div
      onClick={onClick}
      className="flex space-x-7 py-[22px] border-b cursor-pointer transition-all"
    >
      <InboxAvatar isGroup={isGroup} />
      <div className="flex flex-col flex-1">
        <div className="flex items-start space-x-3">
          <p className="text-sm text-[#2F80ED] font-bold break-words leading-snug">
            {subject}
          </p>
          <p className="text-xs text-[#4F4F4F] whitespace-nowrap">{date}</p>
        </div>
        {isGroup && (
          <p className="text-sm text-[#4F4F4F] font-medium mt-[2px]">
            {sender} :
          </p>
        )}
        <p className="text-sm text-[#4F4F4F] truncate">{preview}</p>
      </div>
      {isUnread && (
        <div className="h-[10px] w-[10px] bg-red-500 rounded-full self-center" />
      )}
    </div>
  );
}

export default function PanelInbox() {
  const [selectedChat, setSelectedChat] = useState<InboxItemType | null>(null);
  const { data, loading } = useQuery(GET_INBOX_LIST);

  if (selectedChat) {
    return (
      <PanelDetailInbox
        subject={selectedChat.subject}
        chatId={selectedChat.id}
        isGroup={selectedChat.isGroup ?? true}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  return (
    <div className="fixed bottom-[100px] bg-card right-6 z-40 flex flex-col gap-4 px-8 py-6 w-full max-w-[734px] h-full max-h-[737px] rounded-sm border border-[#828282] overflow-hidden">
      <div className="mb-[22px]">
        <SearchInput />
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner className="text-[#C4C4C4]">
              <span className="text-[#4F4F4F] font-bold">Loading Chats...</span>
            </Spinner>
          </div>
        ) : (
          data?.inboxList.map((item: InboxItemType) => (
            <InboxItem
              key={item.id}
              data={item}
              onClick={() => setSelectedChat(item)}
            />
          ))
        )}
      </div>
    </div>
  );
}
