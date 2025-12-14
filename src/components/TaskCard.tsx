'use client';

import type { Task, Priority } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { Calendar, Flag } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEditClick: (task: Task) => void;
  isDuplicate: boolean;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

const priorityStyles: Record<Priority, string> = {
  High: 'text-chart-1',
  Medium: 'text-chart-4',
  Low: 'text-chart-2',
};

const TaskCard = ({ task, onEditClick, isDuplicate, isDragging, onDragStart, onDragEnd }: TaskCardProps) => {
  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-card/70',
        isDragging && 'opacity-50 ring-2 ring-primary'
      )}
      onClick={() => onEditClick(task)}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
    >
      <CardHeader>
        <CardTitle className="text-base font-semibold">{task.title}</CardTitle>
        {task.description && <CardDescription className="text-sm line-clamp-2">{task.description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flag className={cn('h-4 w-4', priorityStyles[task.priority])} />
          <span className={cn('text-sm font-medium', priorityStyles[task.priority])}>
            {task.priority}
          </span>
        </div>
        {isDuplicate && <Badge variant="destructive">Duplicate</Badge>}
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <p>Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</p>
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
