"use client";

import { Droppable } from "@hello-pangea/dnd";
import type { Task, Tag, Lane } from "@/lib/types";
import { LANE_CONFIG } from "@/lib/types";
import { TaskCard } from "./TaskCard";

interface SwimLaneProps {
  lane: Lane;
  day: string;
  tasks: Task[];
  allTags: Tag[];
  onAddTask: (day: string, lane: Lane) => void;
  onEditTask: (task: Task) => void;
}

export function SwimLane({
  lane,
  day,
  tasks,
  allTags,
  onAddTask,
  onEditTask,
}: SwimLaneProps) {
  const config = LANE_CONFIG[lane];
  const droppableId = `${day}-${lane}`;

  return (
    <div className={`swim-lane swim-lane-${lane}`}>
      {/* Lane header */}
      <div className="swim-lane-header">
        <div className="swim-lane-title">
          <span className="swim-lane-icon">{config.icon}</span>
          <span className="swim-lane-label">{config.label}</span>
          {tasks.length > 0 && (
            <span className="swim-lane-count">{tasks.length}</span>
          )}
        </div>
        <button
          id={`add-task-${day}-${lane}`}
          className="swim-lane-add-btn"
          onClick={() => onAddTask(day, lane)}
          aria-label={`${config.label} lane'ine görev ekle`}
          title="Görev ekle"
        >
          +
        </button>
      </div>

      {/* Droppable task list */}
      <Droppable droppableId={droppableId} type="TASK">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`swim-lane-body ${snapshot.isDraggingOver ? "swim-lane-body-over" : ""}`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                allTags={allTags}
                onClick={onEditTask}
              />
            ))}
            {provided.placeholder}

            {/* Empty state */}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="swim-lane-empty">
                <span>Görev yok</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
