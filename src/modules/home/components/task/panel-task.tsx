"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon, PenIcon, Clock, EllipsisIcon } from "lucide-react";
import { format, parseISO, differenceInCalendarDays, isToday } from "date-fns";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/customs/spinner";
import { DatePicker } from "@/components/ui/customs/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/customs/multi-select";
import { config } from "@/config";

enum Sticker {
  ImportantASAP = "Important ASAP",
  OfflineMeeting = "Offline Meeting",
  VirtualMeeting = "Virtual Meeting",
  ASAP = "ASAP",
  ClientRelated = "Client Related",
  SelfTask = "Self Task",
  Appointments = "Appointments",
  CourtRelated = "Court Related",
}

interface Task {
  id: number;
  category: string;
  title: string;
  dueDate: string;
  description: string;
  completed: boolean;
  stickers: Sticker[] | null;
}

export default function PanelTask() {
  const [isLoading, setIsLoading] = useState(true);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [editingTitleId, setEditingTitleId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${config.BASE_URL_API}/tasks?page=1&limit=5`);
        const json = await res.json();

        if (json.success) {
          setTaskList(json.data.tasks);
        } else {
          console.error("Failed to fetch:", json.message);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const createTask = () => {
    const newTask: Task = {
      id: Date.now(),
      category: "Urgent To-Do",
      title: "",
      dueDate: new Date().toISOString(),
      description: "",
      completed: false,
      stickers: null,
    };
    setTaskList((prev) => [newTask, ...prev]);
  };

  const updateTask = (
    id: number,
    field: keyof Task,
    value: string | boolean | Sticker[]
  ) => {
    setTaskList((prev) =>
      prev.map((task) => (task.id === id ? { ...task, [field]: value } : task))
    );
  };

  const toggleTask = (id: number) => {
    setTaskList((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTaskList((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <section className="fixed bottom-[100px] right-6 z-40 flex flex-col gap-4 px-8 py-6 w-full max-w-[734px] h-full max-h-[737px] rounded-sm bg-card border border-[#828282] overflow-y-auto">
      <TaskHeader onNew={createTask} />

      {isLoading ? (
        <Spinner className="text-[#4F4F4F]">Loading Tasks List...</Spinner>
      ) : (
        <Accordion type="multiple" className="w-full">
          {taskList.map((task) => (
            <TaskAccordionItem
              key={task.id}
              task={task}
              editingTitleId={editingTitleId}
              editingId={editingId}
              setEditingTitleId={setEditingTitleId}
              setEditingId={setEditingId}
              updateTask={updateTask}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
            />
          ))}
        </Accordion>
      )}
    </section>
  );
}

function TaskHeader({ onNew }: { onNew: () => void }) {
  return (
    <header className="flex justify-between items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            My Tasks
            <ChevronDownIcon className="-me-1 opacity-60" size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Urgent To-Do</DropdownMenuItem>
          <DropdownMenuItem>Personal Errands</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        className="bg-[#2F80ED] text-white text-sm px-4 py-2 hover:bg-[#2F80ED] cursor-pointer hover:opacity-70"
        onClick={onNew}
      >
        New Task
      </Button>
    </header>
  );
}

function TaskAccordionItem({
  task,
  editingTitleId,
  editingId,
  setEditingTitleId,
  setEditingId,
  updateTask,
  toggleTask,
  deleteTask,
}: {
  task: Task;
  editingTitleId: number | null;
  editingId: string | null;
  setEditingTitleId: (id: number | null) => void;
  setEditingId: (id: string | null) => void;
  updateTask: (
    id: number,
    field: keyof Task,
    value: string | boolean | Sticker[]
  ) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}) {
  return (
    <AccordionItem
      value={task.id.toString()}
      className={cn("border-t pt-4", task.completed && "opacity-60")}
      asChild
    >
      <article>
        <div className="flex items-center justify-start">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTask(task.id)}
            aria-label={`Mark ${task.title} as completed`}
          />
          <div className="flex w-full ml-4 items-center justify-between space-x-3">
            <TaskTitle
              task={task}
              isEditing={editingTitleId === task.id}
              setEditingTitleId={setEditingTitleId}
              updateTask={updateTask}
            />

            <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
              {!task.completed && <TaskDueInfo date={task.dueDate} />}
              <time className="text-sm font-normal">
                {format(parseISO(task.dueDate), "dd/MM/yyyy")}
              </time>
              <AccordionTrigger
                aria-label="Toggle details"
                className="cursor-pointer"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full cursor-pointer"
                  >
                    <EllipsisIcon size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => deleteTask(task.id)}
                    className="text-[#EB5757] dark:text-[#EB5757] cursor-pointer"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <AccordionContent asChild>
          <div>
            <div className="flex items-center gap-2 mt-2 ml-8 text-gray-600">
              <Clock size={20} className="text-[#2F80ED]" />
              <DatePicker
                date={task.dueDate ? new Date(task.dueDate) : undefined}
                setDate={(date) => {
                  if (date) {
                    updateTask(task.id, "dueDate", date.toISOString());
                  }
                }}
              />
            </div>
            <TaskDescription
              task={task}
              editingId={editingId}
              setEditingId={setEditingId}
              updateTask={updateTask}
            />
          </div>
          <TaskSticker task={task} updateTask={updateTask} />
        </AccordionContent>
      </article>
    </AccordionItem>
  );
}

function TaskTitle({
  task,
  isEditing,
  setEditingTitleId,
  updateTask,
}: {
  task: Task;
  isEditing: boolean;
  setEditingTitleId: (id: number | null) => void;
  updateTask: (
    id: number,
    field: keyof Task,
    value: string | boolean | Sticker[]
  ) => void;
}) {
  return isEditing ? (
    <Input
      value={task.title}
      onChange={(e) => updateTask(task.id, "title", e.target.value)}
      onBlur={() => setEditingTitleId(null)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          (e.target as HTMLTextAreaElement).blur();
        }
      }}
      autoFocus
      placeholder="Type Task Title"
      className={cn("focus-visible:ring-0", task.completed && "line-through")}
    />
  ) : (
    <h3
      onClick={() => setEditingTitleId(task.id)}
      className={cn(
        "text-sm font-semibold text-[#4F4F4F] flex-1 cursor-text break-words",
        task.completed && "line-through"
      )}
    >
      {task.title || <span className="text-gray-400">Type Task Title</span>}
    </h3>
  );
}

function TaskDueInfo({ date }: { date: string }) {
  const due = parseISO(date);
  const daysDiff = differenceInCalendarDays(due, new Date());

  if (isToday(due)) {
    return <span className="text-yellow-500 text-sm">Due Today</span>;
  }

  if (daysDiff < 0) {
    return (
      <span className="text-red-500 text-sm">
        {Math.abs(daysDiff)} day{Math.abs(daysDiff) > 1 ? "s" : ""} overdue
      </span>
    );
  }

  return (
    <span className="text-green-600 text-sm">
      {daysDiff} day{daysDiff > 1 ? "s" : ""} left
    </span>
  );
}

function TaskDescription({
  task,
  editingId,
  setEditingId,
  updateTask,
}: {
  task: Task;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  updateTask: (id: number, field: keyof Task, value: string) => void;
}) {
  const isEditing = editingId === `${task.id}-desc`;

  return (
    <div className="text-gray-700 mt-2 flex items-start ml-7 gap-2 p-1">
      <PenIcon
        size={20}
        className="flex-shrink-0 mt-0.5 cursor-pointer text-[#2F80ED]"
        onClick={() => setEditingId(`${task.id}-desc`)}
      />
      <Textarea
        value={task.description}
        onChange={(e) => updateTask(task.id, "description", e.target.value)}
        placeholder="No Description"
        onFocus={() => setEditingId(`${task.id}-desc`)}
        onBlur={() => setEditingId(null)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
            setEditingId(null);
          }
        }}
        className={cn(
          "text-sm flex-1 resize-none outline-none bg-transparent dark:bg-card border-0 p-0 shadow-none",
          isEditing &&
            "border-input border rounded-md px-3 py-2 shadow-xs mt-0 focus-visible:border-ring focus-visible:ring-0"
        )}
      />
    </div>
  );
}

function TaskSticker({
  task,
  updateTask,
}: {
  task: Task;
  updateTask: (
    id: number,
    field: keyof Task,
    value: Sticker[] | string | boolean
  ) => void;
}) {
  const handleChange = (newStickers: string[]) => {
    const stickers = newStickers as Sticker[];
    updateTask(task.id, "stickers", stickers);
  };

  return (
    <div className="mt-3 ml-8">
      <MultiSelect
        values={task.stickers ?? []}
        onChange={handleChange}
        options={Object.values(Sticker)}
        placeholder="Select Stickers"
      />
    </div>
  );
}
