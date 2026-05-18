"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Task } from "@/lib/types";

/**
 * Real-time listener for tasks in a given week (7 days starting from weekStartISO).
 * Groups tasks by `day-lane` key for efficient lookup.
 */
export function useTasks(userId: string | undefined, weekDates: string[]) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || weekDates.length === 0) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      where("userId", "==", userId),
      where("day", "in", weekDates),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      setTasks(taskList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, weekDates]);

  /**
   * Get tasks for a specific day and lane, sorted by order
   */
  function getTasksForCell(day: string, lane: string): Task[] {
    return tasks
      .filter((t) => t.day === day && t.lane === lane)
      .sort((a, b) => a.order - b.order);
  }

  return { tasks, loading, getTasksForCell };
}
