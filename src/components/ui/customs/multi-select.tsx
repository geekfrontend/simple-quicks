"use client";

import * as React from "react";
import { Bookmark } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  values: string[];
  onChange: (values: string[]) => void;
  options: string[];
  placeholder?: string;
}

const stickerColorMap: Record<string, string> = {
  "Important ASAP": "bg-[#E5F1FF] text-[#4F4F4F]",
  "Offline Meeting": "bg-[#FDCFA4] text-[#4F4F4F]",
  "Virtual Meeting": "bg-[#F9E9C3] text-[#4F4F4F]",
  ASAP: "bg-[#AFEBDB] text-[#4F4F4F]",
  "Client Related": "bg-[#CBF1C2] text-[#4F4F4F]",
  "Self Task": "bg-[#CFCEF9] text-[#4F4F4F]",
  Appointments: "bg-[#F9E0FD] text-[#4F4F4F]",
  "Court Related": "bg-[#9DD0ED] text-[#4F4F4F]",
};

export function MultiSelect({
  values,
  onChange,
  options,
  placeholder = "Select Stickers",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleValue = (value: string) => {
    onChange(
      values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value]
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen(!open)}
          onKeyDown={(e) => e.key === "Enter" && setOpen(!open)}
          className={cn(
            "w-full min-h-[42px] px-3 py-2 rounded-md border border-input text-sm bg-[#F9F9F9] dark:bg-card flex gap-2 items-center cursor-pointer transition-all"
          )}
        >
          <Bookmark className="h-4 w-4 opacity-80 shrink-0 text-[#2F80ED]" />
          <div className="flex flex-wrap gap-2 items-center">
            {values.length > 0 ? (
              values.map((val) => (
                <span
                  key={val}
                  className={cn(
                    "px-2 py-0.5 text-xs rounded-sm font-medium border whitespace-nowrap cursor-pointer",
                    stickerColorMap[val] || "bg-muted text-muted"
                  )}
                >
                  {val}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[250px] border-ring p-3 space-y-1"
        align="start"
      >
        {options.map((opt) => {
          const selected = values.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggleValue(opt)}
              className={cn(
                "flex items-center justify-between w-full px-2 py-2 rounded-sm border font-medium text-sm transition cursor-pointer",
                selected
                  ? cn(stickerColorMap[opt], "border-2 border-[#2F80ED]")
                  : cn(stickerColorMap[opt], "hover:border-[#2F80ED]")
              )}
            >
              <span>{opt}</span>
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
