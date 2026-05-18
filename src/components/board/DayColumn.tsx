"use client";

import type { Task, Tag, Lane, DayData } from "@/lib/types";
import { SwimLane } from "./SwimLane";

interface DayColumnProps {
  day: DayData;
  getTasksForCell: (day: string, lane: string) => Task[];
  allTags: Tag[];
  onAddTask: (day: string, lane: Lane) => void;
  onEditTask: (task: Task) => void;
}

const LANES: Lane[] = ["backlog", "inprogress", "done"];

export function DayColumn({
  day,
  getTasksForCell,
  allTags,
  onAddTask,
  onEditTask,
}: DayColumnProps) {
  return (
    <div className={`day-column ${day.isToday ? "day-column-today" : ""}`}>
      {/* Day header */}
      <div className={`day-column-header ${day.isToday ? "day-column-header-today" : ""}`}>
        <div className="day-column-header-inner">
          <span className="day-column-name">{day.dayName}</span>
          <div className="day-column-date">
            <span className={`day-column-number ${day.isToday ? "day-column-number-today" : ""}`}>
              {day.dayNumber}
            </span>
            <span className="day-column-month">{day.monthName}</span>
          </div>
        </div>
        {day.isToday && <span className="day-column-today-badge">Bugün</span>}
      </div>

      {/* Swim lanes */}
      <div className="day-column-lanes">
        {LANES.map((lane) => (
          <SwimLane
            key={lane}
            lane={lane}
            day={day.date}
            tasks={getTasksForCell(day.date, lane)}
            allTags={allTags}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </div>
  );
}
