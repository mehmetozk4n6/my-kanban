"use client";

import { useSwipeable } from "react-swipeable";
import type { DayData } from "@/lib/types";

interface MobileDayPickerProps {
  days: DayData[];
  activeDayIndex: number;
  onSelectDay: (index: number) => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function MobileDayPicker({
  days,
  activeDayIndex,
  onSelectDay,
  onSwipeLeft,
  onSwipeRight,
}: MobileDayPickerProps) {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: onSwipeLeft,
    onSwipedRight: onSwipeRight,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
    delta: 50, // minimum px to trigger swipe
  });

  return (
    <div className="mobile-day-picker" {...swipeHandlers}>
      {/* Day selector pills */}
      <div className="mobile-day-tabs">
        {days.map((day, i) => (
          <button
            key={day.date}
            id={`mobile-day-${day.date}`}
            className={`mobile-day-tab ${
              i === activeDayIndex ? "mobile-day-tab-active" : ""
            } ${day.isToday ? "mobile-day-tab-today" : ""}`}
            onClick={() => onSelectDay(i)}
            aria-pressed={i === activeDayIndex}
          >
            <span className="mobile-day-tab-name">{day.dayName}</span>
            <span className="mobile-day-tab-number">{day.dayNumber}</span>
            {day.isToday && <span className="mobile-day-today-dot" />}
          </button>
        ))}
      </div>

      {/* Swipe hint */}
      <div className="mobile-swipe-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Kaydır</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}
