export type Priority = 'Low' | 'Medium' | 'High';
export const priorities: Priority[] = ['Low', 'Medium', 'High'];

export type Status = 'To-Do' | 'In-Progress' | 'Completed';
export const statuses: Status[] = ['To-Do', 'In-Progress', 'Completed'];

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: string;
  createdAt: string;
}

export type SortOption = 'createdAt_asc' | 'createdAt_desc' | 'dueDate_asc';
