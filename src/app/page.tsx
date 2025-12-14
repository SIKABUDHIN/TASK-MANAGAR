'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Task, Status, Priority, SortOption } from '@/lib/types';
import { statuses } from '@/lib/types';
import TaskColumn from '@/components/TaskColumn';
import TaskForm from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { compareAsc, compareDesc, parseISO } from 'date-fns';

const LOCAL_STORAGE_KEY = 'task-managar-tasks';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('createdAt_desc');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        fetch('/tasks.json')
          .then((res) => res.json())
          .then((initialTasks) => {
            setTasks(initialTasks);
          });
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      // Fallback to fetching from json if localStorage fails
      fetch('/tasks.json')
        .then((res) => res.json())
        .then((initialTasks) => {
          setTasks(initialTasks);
        });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks:', error);
      }
    }
  }, [tasks, isLoading]);

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'To-Do',
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setTaskToEdit(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setTaskToEdit(null);
  };

  const handleEditClick = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleUpdateTaskStatus = useCallback((taskId: string, newStatus: Status) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  const duplicateTitles = useMemo(() => {
    const titleStatusPairs = new Set<string>();
    const duplicates = new Set<string>();
    tasks.forEach(task => {
      const pair = `${task.title.toLowerCase()}|${task.status}`;
      if (titleStatusPairs.has(pair)) {
        duplicates.add(task.id);
        // Also mark the first occurrence
        const firstTask = tasks.find(t => t.title.toLowerCase() === task.title.toLowerCase() && t.status === task.status);
        if (firstTask) {
          duplicates.add(firstTask.id);
        }
      } else {
        titleStatusPairs.add(pair);
      }
    });
    return duplicates;
  }, [tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    if (filterPriority !== 'all') {
      result = result.filter((task) => task.priority === filterPriority);
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case 'createdAt_asc':
          return compareAsc(parseISO(a.createdAt), parseISO(b.createdAt));
        case 'createdAt_desc':
          return compareDesc(parseISO(a.createdAt), parseISO(b.createdAt));
        case 'dueDate_asc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return compareAsc(parseISO(a.dueDate), parseISO(b.dueDate));
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, filterPriority, sortOption]);

  const onFormOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setTaskToEdit(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-body">
      <header className="flex items-center justify-between p-4 border-b shrink-0 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight font-headline">TASK MANAGAR</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
            <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as Priority | 'all')}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
            <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt_desc">Newest First</SelectItem>
                <SelectItem value="createdAt_asc">Oldest First</SelectItem>
                <SelectItem value="dueDate_asc">Due Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-w-[900px]">
          {statuses.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={filteredAndSortedTasks.filter((task) => task.status === status)}
              onEditClick={handleEditClick}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              duplicateTitles={duplicateTitles}
              draggedTaskId={draggedTaskId}
              setDraggedTaskId={setDraggedTaskId}
            />
          ))}
        </div>
      </main>

      <TaskForm
        open={isFormOpen}
        onOpenChange={onFormOpenChange}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
