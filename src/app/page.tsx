import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Home from "@/modules/home";

export default function HomePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <ThemeToggle />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl" />
            <div className="aspect-video rounded-xl" />
            <div className="aspect-video rounded-xl" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
        <Home />
      </SidebarInset>
    </SidebarProvider>
  );
}
