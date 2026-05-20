import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
  serverTimestamp,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Task, Tag, Lane } from "./types";
import { getTodayISO } from "./date-utils";

// ── Task Operations ─────────────────────────────────────────────

const tasksRef = collection(db, "tasks");

export async function addTask(
  userId: string,
  data: {
    title: string;
    description: string;
    priority: Task["priority"];
    tags: string[];
    day: string;
    lane: Lane;
  }
): Promise<string> {
  // Get the current max order in the target lane+day
  const maxOrder = await getMaxOrder(userId, data.day, data.lane);

  const docRef = await addDoc(tasksRef, {
    userId,
    title: data.title,
    description: data.description,
    priority: data.priority,
    tags: data.tags,
    day: data.day,
    lane: data.lane,
    order: maxOrder + 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateTask(
  taskId: string,
  data: Partial<Omit<Task, "id" | "userId" | "createdAt">>
): Promise<void> {
  const docRef = doc(db, "tasks", taskId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTask(taskId: string): Promise<void> {
  const docRef = doc(db, "tasks", taskId);
  await deleteDoc(docRef);
}

async function getMaxOrder(
  userId: string,
  day: string,
  lane: Lane
): Promise<number> {
  const q = query(
    tasksRef,
    where("userId", "==", userId),
    where("day", "==", day),
    where("lane", "==", lane),
    orderBy("order", "desc")
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return 0;
  return snapshot.docs[0].data().order || 0;
}

/**
 * Reorder tasks after drag & drop.
 * Updates the order field for all tasks in the target lane+day.
 */
export async function reorderTasks(
  taskId: string,
  newDay: string,
  newLane: Lane,
  newOrder: number,
  userId: string
): Promise<void> {
  const batch = writeBatch(db);

  // Update the moved task
  const taskRef = doc(db, "tasks", taskId);
  batch.update(taskRef, {
    day: newDay,
    lane: newLane,
    order: newOrder,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}

/**
 * Batch update multiple tasks (order, day, lane).
 * Used after drag-and-drop to reindex and move tasks.
 */
export async function batchUpdateTasks(
  tasksToUpdate: { id: string; day?: string; lane?: string; order?: number }[]
): Promise<void> {
  const batch = writeBatch(db);

  tasksToUpdate.forEach((task) => {
    const ref = doc(db, "tasks", task.id);
    const updateData: any = { updatedAt: serverTimestamp() };
    if (task.day !== undefined) updateData.day = task.day;
    if (task.lane !== undefined) updateData.lane = task.lane;
    if (task.order !== undefined) updateData.order = task.order;
    batch.update(ref, updateData);
  });

  await batch.commit();
}

/**
 * Migrate overdue tasks (backlog/inprogress) to today.
 * Called when the board mounts.
 */
export async function migrateOverdueTasks(userId: string): Promise<number> {
  const today = getTodayISO();

  const q = query(
    tasksRef,
    where("userId", "==", userId),
    where("day", "<", today),
    where("lane", "in", ["backlog", "inprogress", "holded"])
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return 0;

  const batch = writeBatch(db);
  let count = 0;

  snapshot.docs.forEach((docSnap) => {
    const ref = doc(db, "tasks", docSnap.id);
    batch.update(ref, {
      day: today,
      updatedAt: serverTimestamp(),
    });
    count++;
  });

  await batch.commit();
  return count;
}

// ── Tag Operations ──────────────────────────────────────────────

const tagsRef = collection(db, "tags");

export async function addTag(
  userId: string,
  name: string,
  color: string
): Promise<string> {
  const docRef = await addDoc(tagsRef, {
    userId,
    name,
    color,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateTag(
  tagId: string,
  data: { name?: string; color?: string }
): Promise<void> {
  const docRef = doc(db, "tags", tagId);
  await updateDoc(docRef, data);
}

export async function deleteTag(tagId: string): Promise<void> {
  const docRef = doc(db, "tags", tagId);
  await deleteDoc(docRef);
}
