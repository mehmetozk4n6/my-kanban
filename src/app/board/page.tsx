"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { WeekNavigation } from "@/components/board/WeekNavigation";
import { UserMenu } from "@/components/auth/UserMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useWeekNavigation } from "@/hooks/useWeekNavigation";
import { useTasks } from "@/hooks/useTasks";
import { useTags } from "@/hooks/useTags";

export default function BoardPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  const { weekDays, weekDates, weekRange, isCurrentWeek, goNextWeek, goPrevWeek, goToday } =
    useWeekNavigation();

  const { tasks, loading: tasksLoading, getTasksForCell } = useTasks(user?.uid, weekDates);
  const { tags } = useTags(user?.uid);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="splash-screen">
        <div className="splash-spinner" />
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header-left">
          {/* Logo */}
          <div className="app-logo">
            <div className="app-logo-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="9" rx="2" fill="currentColor" opacity="0.9" />
                <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" opacity="0.6" />
                <rect x="12" y="3" width="9" height="5" rx="2" fill="currentColor" opacity="0.7" />
                <rect x="12" y="10" width="9" height="11" rx="2" fill="currentColor" opacity="0.9" />
              </svg>
            </div>
            <span className="app-logo-text">MyKanban</span>
          </div>
        </div>

        {/* Week navigation (center) */}
        <div className="app-header-center">
          <WeekNavigation
            weekRange={weekRange}
            isCurrentWeek={isCurrentWeek}
            onPrev={goPrevWeek}
            onNext={goNextWeek}
            onToday={goToday}
          />
        </div>

        {/* Right controls */}
        <div className="app-header-right">
          {tasksLoading && <span className="app-loading-dot" title="Yükleniyor" />}
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      {/* ── Board ── */}
      <main className="app-main">
        <KanbanBoard
          userId={user.uid}
          weekDays={weekDays}
          tasks={tasks}
          allTags={tags}
          getTasksForCell={getTasksForCell}
        />
      </main>
    </div>
  );
}
