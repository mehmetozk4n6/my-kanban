import { Timestamp } from "firebase/firestore";

export type Priority = "low" | "medium" | "high" | "critical";
export type Lane = "backlog" | "inprogress" | "done";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: Priority;
  tags: string[]; // Tag IDs
  day: string; // ISO date "2025-05-19"
  lane: Lane;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  color: string; // Hex color "#3B82F6"
  createdAt: Timestamp;
}

export interface DayData {
  date: string; // ISO date
  dayName: string; // "Pzt", "Sal", etc.
  dayNumber: number; // 19
  monthName: string; // "May"
  isToday: boolean;
}

export const LANE_CONFIG: Record<Lane, { label: string; icon: string }> = {
  backlog: { label: "Backlog", icon: "📋" },
  inprogress: { label: "In Progress", icon: "🔄" },
  done: { label: "Done", icon: "✅" },
};

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bgColor: string }
> = {
  low: { label: "Low", color: "#64748B", bgColor: "#F1F5F9" },
  medium: { label: "Medium", color: "#3B82F6", bgColor: "#EFF6FF" },
  high: { label: "High", color: "#F97316", bgColor: "#FFF7ED" },
  critical: { label: "Critical", color: "#EF4444", bgColor: "#FEF2F2" },
};

export const PRESET_TAG_COLORS = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#EAB308", // Yellow
  "#84CC16", // Lime
  "#22C55E", // Green
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#A855F7", // Purple
  "#D946EF", // Fuchsia
  "#EC4899", // Pink
  "#F43F5E", // Rose
  "#78716C", // Stone
];
