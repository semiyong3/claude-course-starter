"use client";

import { Priority, Todo } from "@/lib/types";
import { fd, priorityLabels } from "@/lib/utils";
import Checkbox from "./Checkbox";

const priorityStyles: Record<Priority, string> = {
  high: "bg-red-50 text-red-600",
  medium: "bg-amber-50 text-amber-600",
  low: "bg-gray-100 text-gray-500",
};

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 transition-colors duration-200 hover:bg-orange-50/40">
      <Checkbox checked={todo.completed} onChange={() => onToggle(todo.id)} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${priorityStyles[todo.priority]}`}
          >
            {priorityLabels[todo.priority]}
          </span>
          <p
            className={`transition-colors duration-200 ${
              todo.completed ? "text-gray-400 line-through" : "text-gray-800"
            }`}
          >
            {todo.text}
          </p>
        </div>
        <span className="text-xs text-gray-400">
          {todo.dueDate && (
            <span className="font-medium text-[#D97757]">
              마감 {fd(todo.dueDate)} ·{" "}
            </span>
          )}
          {fd(todo.createdAt)}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="rounded-md px-2 py-1 text-sm text-gray-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-500"
      >
        삭제
      </button>
    </li>
  );
}
