export type Priority = "high" | "medium" | "low";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority: Priority;
}

export type Filter = "all" | "active" | "completed";
