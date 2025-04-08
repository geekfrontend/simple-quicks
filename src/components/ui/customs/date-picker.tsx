"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  setDate?: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePicker({ date, setDate, placeholder }: DatePickerProps) {
  const displayText = date
    ? format(date, "dd/MM/yyyy")
    : placeholder || "Set Date";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-max gap-2 px-4 py-2 justify-between items-center dark:bg-card",
            !date && "text-muted-foreground"
          )}
        >
          <span>{displayText}</span>
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
