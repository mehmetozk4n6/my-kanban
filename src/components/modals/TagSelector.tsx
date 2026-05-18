"use client";

import { useState } from "react";
import type { Tag } from "@/lib/types";
import { PRESET_TAG_COLORS } from "@/lib/types";
import { TagPill } from "@/components/ui/TagPill";
import { addTag } from "@/lib/firestore";

interface TagSelectorProps {
  userId: string;
  allTags: Tag[];
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagSelector({
  userId,
  allTags,
  selectedTagIds,
  onChange,
}: TagSelectorProps) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PRESET_TAG_COLORS[9]); // Default indigo
  const [saving, setSaving] = useState(false);

  function toggleTag(tagId: string) {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const id = await addTag(userId, newName.trim(), newColor);
      onChange([...selectedTagIds, id]);
      setNewName("");
      setNewColor(PRESET_TAG_COLORS[9]);
      setCreating(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="tag-selector">
      <label className="form-label">Etiketler</label>

      {/* Existing tags */}
      <div className="tag-selector-list">
        {allTags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              className={`tag-selector-item ${isSelected ? "tag-selector-item-selected" : ""}`}
              onClick={() => toggleTag(tag.id)}
            >
              <TagPill name={tag.name} color={tag.color} />
              {isSelected && <span className="tag-selector-check">✓</span>}
            </button>
          );
        })}

        {/* Add new tag button */}
        {!creating && (
          <button
            type="button"
            id="add-tag-btn"
            className="tag-selector-add-btn"
            onClick={() => setCreating(true)}
          >
            <span>+</span> Yeni Etiket
          </button>
        )}
      </div>

      {/* New tag form */}
      {creating && (
        <div className="tag-create-form">
          <input
            id="new-tag-name"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Etiket adı..."
            className="tag-create-input"
            maxLength={20}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setCreating(false);
            }}
          />

          {/* Color picker */}
          <div className="tag-color-grid">
            {PRESET_TAG_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`tag-color-swatch ${newColor === color ? "tag-color-swatch-selected" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => setNewColor(color)}
                aria-label={`Renk: ${color}`}
              />
            ))}
          </div>

          {/* Preview */}
          {newName && (
            <div className="tag-create-preview">
              <span className="form-hint">Önizleme:</span>
              <TagPill name={newName} color={newColor} />
            </div>
          )}

          <div className="tag-create-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setCreating(false);
                setNewName("");
              }}
            >
              İptal
            </button>
            <button
              type="button"
              id="save-tag-btn"
              className="btn-primary"
              disabled={!newName.trim() || saving}
              onClick={handleCreate}
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
