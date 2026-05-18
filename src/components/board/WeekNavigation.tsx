"use client";

import type { DayData } from "@/lib/types";

interface WeekNavigationProps {
  weekRange: string;
  isCurrentWeek: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function WeekNavigation({
  weekRange,
  isCurrentWeek,
  onPrev,
  onNext,
  onToday,
}: WeekNavigationProps) {
  return (
    <div className="week-nav">
      <button
        id="prev-week-btn"
        className="week-nav-arrow"
        onClick={onPrev}
        aria-label="Önceki hafta"
        title="Önceki hafta"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="week-nav-center">
        <span className="week-nav-range">{weekRange}</span>
        {!isCurrentWeek && (
          <button
            id="today-btn"
            className="week-nav-today-btn"
            onClick={onToday}
          >
            Bugüne Dön
          </button>
        )}
      </div>

      <button
        id="next-week-btn"
        className="week-nav-arrow"
        onClick={onNext}
        aria-label="Sonraki hafta"
        title="Sonraki hafta"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
