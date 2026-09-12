import { AlertTriangle, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const CONFIG = {
  note: { icon: Info, label: "Note" },
  warning: { icon: AlertTriangle, label: "Warning" },
} as const;

export function Callout({
  type = "note",
  children,
}: {
  type?: "note" | "warning";
  children: ReactNode;
}) {
  const { icon: Icon, label } = CONFIG[type];

  return (
    <div
      className={cn(
        "not-prose my-8 flex gap-3 border-l-2 py-1 pl-5",
        type === "warning" ? "border-accent" : "border-muted-foreground/40"
      )}
    >
      <Icon
        className={cn("mt-1 h-4 w-4 shrink-0", type === "warning" ? "text-accent" : "text-muted-foreground")}
        aria-hidden="true"
      />
      <div className="text-[15px] leading-relaxed text-foreground/90">
        <span className="sr-only">{label}: </span>
        {children}
      </div>
    </div>
  );
}
