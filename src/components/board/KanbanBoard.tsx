"use client";

import { useState, useEffect, useCallback } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import type { Task, Tag, Lane, DayData } from "@/lib/types";
import { DayColumn } from "./DayColumn";
import { MobileDayPicker } from "./MobileDayPicker";
import { TaskModal } from "@/components/modals/TaskModal";
import { batchUpdateTasks, migrateOverdueTasks } from "@/lib/firestore";

interface KanbanBoardProps {
  userId: string;
  weekDays: DayData[];
  tasks: Task[];
  allTags: Tag[];
  getTasksForCell: (day: string, lane: string) => Task[];
}

interface ModalState {
  open: boolean;
  task?: Task;
  defaultDay?: string;
  defaultLane?: Lane;
}

export function KanbanBoard({
  userId,
  weekDays,
  tasks,
  allTags,
  getTasksForCell,
}: KanbanBoardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(() => {
    // Default to today's index if present, else Monday (0)
    return 0;
  });
  const [modal, setModal] = useState<ModalState>({ open: false });

  // Hydration fix for DnD + set today as default mobile day
  useEffect(() => {
    setIsMounted(true);

    const todayIndex = weekDays.findIndex((d) => d.isToday);
    if (todayIndex >= 0) setActiveDayIndex(todayIndex);

    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [weekDays]);

  // Migrate overdue tasks on mount
  useEffect(() => {
    migrateOverdueTasks(userId).catch(console.error);
  }, [userId]);

  // Modal handlers
  const openAddModal = useCallback((day: string, lane: Lane) => {
    setModal({ open: true, defaultDay: day, defaultLane: lane });
  }, []);

  const openEditModal = useCallback((task: Task) => {
    setModal({ open: true, task });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ open: false });
  }, []);

  // Mobile swipe navigation
  const handleSwipeLeft = useCallback(() => {
    setActiveDayIndex((i) => Math.min(i + 1, 6));
  }, []);

  const handleSwipeRight = useCallback(() => {
    setActiveDayIndex((i) => Math.max(i - 1, 0));
  }, []);

  // Drag & drop handler
  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;

      // Dropped outside or same position
      if (!destination) return;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      )
        return;

      // Parse droppableId format: "{isoDate}-{lane}"
      const parseDroppable = (id: string) => {
        const lastDash = id.lastIndexOf("-");
        return {
          day: id.substring(0, lastDash),
          lane: id.substring(lastDash + 1) as Lane,
        };
      };

      const { day: destDay, lane: destLane } = parseDroppable(
        destination.droppableId
      );

      // Get current tasks in destination cell (after the move)
      const destTasks = getTasksForCell(destDay, destLane).filter(
        (t) => t.id !== draggableId
      );

      // Build new ordered list
      const reordered = [...destTasks];
      const movedTask = tasks.find((t) => t.id === draggableId);
      if (!movedTask) return;

      reordered.splice(destination.index, 0, { ...movedTask, day: destDay, lane: destLane });

      // Batch update all tasks in dest cell with new order values and correct day/lane
      const updates = reordered.map((t, index) => ({
        id: t.id,
        day: t.day,
        lane: t.lane,
        order: index,
      }));
      await batchUpdateTasks(updates);
    },
    [tasks, getTasksForCell]
  );

  if (!isMounted) {
    // Server-side / pre-hydration placeholder
    return <div className="board-loading">Yükleniyor...</div>;
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        {isMobile ? (
          /* ── Mobile: single day view ── */
          <div className="board-mobile">
            <MobileDayPicker
              days={weekDays}
              activeDayIndex={activeDayIndex}
              onSelectDay={setActiveDayIndex}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
            <div className="board-mobile-day">
              <DayColumn
                day={weekDays[activeDayIndex]}
                getTasksForCell={getTasksForCell}
                allTags={allTags}
                onAddTask={openAddModal}
                onEditTask={openEditModal}
              />
            </div>
          </div>
        ) : (
          /* ── Desktop: 7-column grid ── */
          <div className="board-desktop">
            {weekDays.map((day) => (
              <DayColumn
                key={day.date}
                day={day}
                getTasksForCell={getTasksForCell}
                allTags={allTags}
                onAddTask={openAddModal}
                onEditTask={openEditModal}
              />
            ))}
          </div>
        )}
      </DragDropContext>

      {/* Task Modal */}
      {modal.open && (
        <TaskModal
          userId={userId}
          allTags={allTags}
          task={modal.task}
          defaultDay={modal.defaultDay}
          defaultLane={modal.defaultLane}
          onClose={closeModal}
        />
      )}
    </>
  );
}
