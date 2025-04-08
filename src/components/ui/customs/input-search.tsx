import { useId } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SearchInput() {
  const id = useId();
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id} className="sr-only">
        Search
      </Label>
      <div className="relative">
        <Input id={id} className="peer pe-9" placeholder="Search" type="text" />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
          <Search size={16} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
