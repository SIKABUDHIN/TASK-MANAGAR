'use client';

import { useState } from 'react';
import type { Task, Status } from '@/lib/types';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  status: Status;
  tasks: Task[];
  onEditClick: (task: Task) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: Status) => void;
  duplicateTitles: Set<string>;
  draggedTaskId: string | null;
  setDraggedTaskId: (id: string | null) => void;
}

const statusColors: Record<Status, string> = {
  'To-Do': 'bg-blue-200 border-blue-400',
  'In-Progress': 'bg-yellow-200 border-yellow-400',
  'Completed': 'bg-green-200 border-green-400',
};


const TaskColumn = ({
  status,
  tasks,
  onEditClick,
  onUpdateTaskStatus,
  duplicateTitles,
  draggedTaskId,
  setDraggedTaskId,
}: TaskColumnProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('taskId', taskId);
  };
  
  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onUpdateTaskStatus(taskId, status);
    }
    setIsDragOver(false);
    setDraggedTaskId(null);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col rounded-lg bg-secondary/50 p-4 h-full transition-colors duration-200',
        isDragOver && 'bg-secondary'
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={cn('w-3 h-3 rounded-full', statusColors[status])} />
        <h2 className="text-lg font-semibold tracking-tight">{status}</h2>
        <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto flex-1 pb-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEditClick={onEditClick}
              isDuplicate={duplicateTitles.has(task.id)}
              isDragging={draggedTaskId === task.id}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground rounded-md border-2 border-dashed border-border">
            <p>No tasks here yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
