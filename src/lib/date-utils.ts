import {
  startOfWeek,
  addDays,
  format,
  isToday as isTodayFn,
  isBefore,
  parseISO,
  addWeeks,
  subWeeks,
} from "date-fns";
import { tr } from "date-fns/locale";
import type { DayData } from "./types";

/**
 * Returns the Monday of the week containing the given date
 */
export function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
}

/**
 * Returns an array of 7 DayData objects for the week containing the given date
 */
export function getWeekDays(weekStart: Date): DayData[] {
  const days: DayData[] = [];
  const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    const isoDate = format(date, "yyyy-MM-dd");
    const monthName = format(date, "MMM", { locale: tr });

    days.push({
      date: isoDate,
      dayName: dayNames[i],
      dayNumber: date.getDate(),
      monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      isToday: isTodayFn(date),
    });
  }

  return days;
}

/**
 * Format week range for header display
 * e.g., "19 - 25 May 2025"
 */
export function formatWeekRange(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  const startMonth = format(weekStart, "MMM", { locale: tr });
  const endMonth = format(weekEnd, "MMM", { locale: tr });
  const year = format(weekEnd, "yyyy");

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  if (startMonth === endMonth) {
    return `${format(weekStart, "d")} - ${format(weekEnd, "d")} ${capitalize(endMonth)} ${year}`;
  }
  return `${format(weekStart, "d")} ${capitalize(startMonth)} - ${format(weekEnd, "d")} ${capitalize(endMonth)} ${year}`;
}

/**
 * Navigate to the next week
 */
export function getNextWeek(weekStart: Date): Date {
  return addWeeks(weekStart, 1);
}

/**
 * Navigate to the previous week
 */
export function getPrevWeek(weekStart: Date): Date {
  return subWeeks(weekStart, 1);
}

/**
 * Check if a given ISO date string is before today
 */
export function isBeforeToday(dateStr: string): boolean {
  const date = parseISO(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isBefore(date, today);
}

/**
 * Get today's date as ISO string
 */
export function getTodayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}
