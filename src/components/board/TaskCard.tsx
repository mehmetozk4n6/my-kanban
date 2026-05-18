"use client";

import { Draggable } from "@hello-pangea/dnd";
import type { Task, Tag } from "@/lib/types";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { TagPill } from "@/components/ui/TagPill";

interface TaskCardProps {
  task: Task;
  index: number;
  allTags: Tag[];
  onClick: (task: Task) => void;
}

export function TaskCard({ task, index, allTags, onClick }: TaskCardProps) {
  const taskTags = allTags.filter((t) => task.tags.includes(t.id));

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${snapshot.isDragging ? "task-card-dragging" : ""}`}
          onClick={() => onClick(task)}
          role="button"
          tabIndex={0}
          aria-label={`Görev: ${task.title}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onClick(task);
          }}
        >
          {/* Priority indicator strip */}
          <div
            className="task-card-priority-strip"
            data-priority={task.priority}
          />

          <div className="task-card-body">
            {/* Top row: title + priority badge */}
            <div className="task-card-top">
              <p className="task-card-title">{task.title}</p>
              <PriorityBadge priority={task.priority} />
            </div>

            {/* Description */}
            {task.description && (
              <p className="task-card-desc">{task.description}</p>
            )}

            {/* Tags */}
            {taskTags.length > 0 && (
              <div className="task-card-tags">
                {taskTags.slice(0, 3).map((tag) => (
                  <TagPill key={tag.id} name={tag.name} color={tag.color} />
                ))}
                {taskTags.length > 3 && (
                  <span className="task-card-tags-more">
                    +{taskTags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
