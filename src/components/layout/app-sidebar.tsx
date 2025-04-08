import * as React from "react";

import { AppName } from "./app-name";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <AppName />
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
