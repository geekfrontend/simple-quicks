"use client";

import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { MessagesSquare, NotepadText, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type TabKey = "none" | "task" | "inbox";

interface QuickActionButtonsProps {
  activeTab: TabKey;
  setActiveTab: Dispatch<SetStateAction<TabKey>>;
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}

export default function QuickActionButtons({
  activeTab,
  setActiveTab,
  isExpanded,
  setIsExpanded,
}: QuickActionButtonsProps) {
  const quickButtons = [
    {
      key: "task",
      label: "Task",
      icon: <NotepadText className="h-5 w-5" />,
      color: "#8785FF",
      hoverColor: "#8785FF",
    },
    {
      key: "inbox",
      label: "Inbox",
      icon: <MessagesSquare className="h-5 w-5" />,
      color: "#F8B76B",
      hoverColor: "#F8B76B",
    },
  ] as const;

  const hasActive = activeTab !== "none";

  const sortedButtons = hasActive
    ? [
        ...quickButtons.filter((btn) => btn.key !== activeTab),
        ...quickButtons.filter((btn) => btn.key === activeTab),
      ]
    : quickButtons;

  const toggleTab = (tab: "task" | "inbox") => {
    setActiveTab((prev) => (prev === tab ? "none" : tab));
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-3",
        !hasActive && "flex-row-reverse"
      )}
    >
      {!hasActive && (
        <Button
          size="icon"
          onClick={() => setIsExpanded((prev) => !prev)}
          className={cn(
            "rounded-full w-[68px] h-[68px] shadow-lg self-end cursor-pointer",
            "bg-[#4A90E2] text-white hover:bg-[#4A90E2]",
            "dark:bg-[#1D4ED8] dark:text-white dark:hover:bg-[#1E40AF]"
          )}
        >
          <Zap className="h-14 w-14" />
        </Button>
      )}

      {sortedButtons.map((btn) => {
        const isActive = activeTab === btn.key;
        return (
          <div key={btn.key} className="flex flex-col items-center gap-2">
            <span
              className={cn(
                "text-xs font-medium text-gray-600 dark:text-gray-300",
                (hasActive || !isExpanded) && "hidden"
              )}
            >
              {btn.label}
            </span>
            <Button
              onClick={() => toggleTab(btn.key)}
              size="icon"
              className={cn(
                "transition-all duration-200 ease-out rounded-full w-[68px] h-[68px] cursor-pointer",
                !hasActive && !isExpanded && "opacity-0 scale-0",
                (isExpanded || isActive) && "opacity-100 scale-100",
                isActive && "ml-3",
                "border",
                "dark:border-gray-600"
              )}
              style={{
                backgroundColor: isActive ? btn.color : "white",
                color: isActive ? "white" : btn.color,
                boxShadow: isActive
                  ? "-12px 0px 0px rgba(79, 79, 79, 0.1)"
                  : "",
              }}
            >
              {btn.icon}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
