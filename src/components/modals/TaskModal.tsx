"use client";

import { useState, useEffect, useCallback } from "react";
import { format, addDays, subDays, parseISO } from "date-fns";
import type { Task, Tag, Lane, Priority } from "@/lib/types";
import { LANE_CONFIG } from "@/lib/types";
import { addTask, updateTask, deleteTask } from "@/lib/firestore";
import { TagSelector } from "./TagSelector";
import { TagPill } from "@/components/ui/TagPill";

interface TaskModalProps {
  userId: string;
  allTags: Tag[];
  // When adding a new task:
  defaultDay?: string;
  defaultLane?: Lane;
  // When editing an existing task:
  task?: Task;
  onClose: () => void;
}

export function TaskModal({
  userId,
  allTags,
  defaultDay,
  defaultLane = "backlog",
  task,
  onClose,
}: TaskModalProps) {
  const isEdit = !!task;

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "medium");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(task?.tags ?? []);
  const [day, setDay] = useState<string>(task?.day ?? defaultDay ?? format(new Date(), "yyyy-MM-dd"));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  async function handleSave() {
    if (!title.trim()) {
      setError("Görev adı zorunludur.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (isEdit) {
        await updateTask(task!.id, {
          title: title.trim(),
          description: description.trim(),
          priority,
          tags: selectedTagIds,
          day,
        });
      } else {
        await addTask(userId, {
          title: title.trim(),
          description: description.trim(),
          priority,
          tags: selectedTagIds,
          day: defaultDay!,
          lane: defaultLane,
        });
      }
      onClose();
    } catch (err: any) {
      console.error("Görev kaydedilirken hata oluştu:", err);
      if (err.message?.includes("index")) {
         setError("Dizin oluşturuluyor. Lütfen tarayıcı konsolundaki (F12 -> Console) linke tıklayarak Firestore dizinini oluşturun.");
      } else {
         setError("Kaydedilemedi. Lütfen tekrar deneyin.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await deleteTask(task!.id);
      onClose();
    } catch {
      setError("Silinemedi. Lütfen tekrar deneyin.");
      setDeleting(false);
    }
  }

  const selectedTags = allTags.filter((t) => selectedTagIds.includes(t.id));

  const priorityOptions: { value: Priority; label: string; color: string }[] = [
    { value: "low", label: "Low", color: "#64748B" },
    { value: "medium", label: "Medium", color: "#3B82F6" },
    { value: "high", label: "High", color: "#F97316" },
    { value: "critical", label: "Critical", color: "#EF4444" },
  ];

  return (
    /* Backdrop */
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-panel">
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {isEdit ? "Görevi Düzenle" : "Yeni Görev"}
          </h2>
          {isEdit && (
            <span className="modal-lane-badge">
              {LANE_CONFIG[task!.lane].icon} {LANE_CONFIG[task!.lane].label}
            </span>
          )}
          <button
            id="modal-close-btn"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Day & Read-only Info */}
          <div className="flex flex-col sm:flex-row gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm border border-slate-100 dark:border-slate-700/50">
            <div className="flex flex-col items-start gap-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Tarih (Gün):</span>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
                <button 
                  type="button"
                  onClick={() => setDay(format(subDays(parseISO(day), 1), "yyyy-MM-dd"))}
                  className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                  title="Önceki Gün"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <span className="text-slate-700 dark:text-slate-300 font-medium text-sm w-24 text-center">{day}</span>
                <button 
                  type="button"
                  onClick={() => setDay(format(addDays(parseISO(day), 1), "yyyy-MM-dd"))}
                  className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                  title="Sonraki Gün"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            </div>
            {isEdit && task?.createdAt && (
              <div className="flex flex-col items-start justify-center gap-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Oluşturulma: </span>
                <span className="text-slate-600 dark:text-slate-400">
                  {typeof task.createdAt.toDate === "function" 
                    ? task.createdAt.toDate().toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }) 
                    : new Date(task.createdAt as any).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Görev Adı <span className="form-required">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ne yapacaksın?"
              className="form-input"
              autoFocus
              maxLength={100}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="task-description" className="form-label">
              Açıklama
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detaylar, notlar..."
              className="form-textarea"
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Priority */}
          <div className="form-group">
            <label className="form-label">Öncelik</label>
            <div className="priority-selector">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  id={`priority-${opt.value}`}
                  className={`priority-option ${priority === opt.value ? "priority-option-selected" : ""}`}
                  style={
                    priority === opt.value
                      ? { borderColor: opt.color, color: opt.color }
                      : {}
                  }
                  onClick={() => setPriority(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <TagSelector
            userId={userId}
            allTags={allTags}
            selectedTagIds={selectedTagIds}
            onChange={setSelectedTagIds}
          />

          {/* Selected tags preview */}
          {selectedTags.length > 0 && (
            <div className="form-group">
              <div className="selected-tags-preview">
                {selectedTags.map((tag) => (
                  <TagPill
                    key={tag.id}
                    name={tag.name}
                    color={tag.color}
                    onRemove={() =>
                      setSelectedTagIds((ids) => ids.filter((id) => id !== tag.id))
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {error && <p className="form-error">{error}</p>}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {isEdit && (
            <button
              id="delete-task-btn"
              type="button"
              className={`btn-danger ${confirmDelete ? "btn-danger-confirm" : ""}`}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting
                ? "Siliniyor..."
                : confirmDelete
                ? "Emin misin? Sil"
                : "Sil"}
            </button>
          )}
          <div className="modal-footer-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              İptal
            </button>
            <button
              id="save-task-btn"
              type="button"
              className="btn-primary"
              onClick={handleSave}
              disabled={saving || !title.trim()}
            >
              {saving ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Ekle"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
