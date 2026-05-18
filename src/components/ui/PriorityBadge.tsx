import type { Priority } from "@/lib/types";
import { PRIORITY_CONFIG } from "@/lib/types";

interface PriorityBadgeProps {
  priority: Priority;
  size?: "sm" | "md";
}

export function PriorityBadge({ priority, size = "sm" }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

  return (
    <span
      className={`priority-badge priority-badge-${size}`}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
      }}
    >
      {config.label}
    </span>
  );
}
