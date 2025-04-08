"use client";

import * as React from "react";
import { Square } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppName() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Square className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">Simple Quicks</span>
            <span className="">Test Simpul Tech</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
