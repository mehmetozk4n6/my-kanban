"use client";

import { useState, useCallback, useMemo } from "react";
import {
  getWeekStart,
  getWeekDays,
  getNextWeek,
  getPrevWeek,
  formatWeekRange,
} from "@/lib/date-utils";
import type { DayData } from "@/lib/types";

export function useWeekNavigation() {
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()));

  const weekDays: DayData[] = useMemo(() => getWeekDays(weekStart), [weekStart]);

  const weekDates: string[] = useMemo(
    () => weekDays.map((d) => d.date),
    [weekDays]
  );

  const weekRange: string = useMemo(() => formatWeekRange(weekStart), [weekStart]);

  const goNextWeek = useCallback(() => {
    setWeekStart((prev) => getNextWeek(prev));
  }, []);

  const goPrevWeek = useCallback(() => {
    setWeekStart((prev) => getPrevWeek(prev));
  }, []);

  const goToday = useCallback(() => {
    setWeekStart(getWeekStart(new Date()));
  }, []);

  const isCurrentWeek = useMemo(() => {
    const todayWeekStart = getWeekStart(new Date());
    return weekStart.getTime() === todayWeekStart.getTime();
  }, [weekStart]);

  return {
    weekStart,
    weekDays,
    weekDates,
    weekRange,
    isCurrentWeek,
    goNextWeek,
    goPrevWeek,
    goToday,
  };
}
