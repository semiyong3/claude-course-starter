"use client";

import { useState } from "react";
import { Priority } from "@/lib/types";
import { priorityLabels } from "@/lib/utils";

const priorities: Priority[] = ["high", "medium", "low"];

interface Props {
  onAdd: (text: string, priority: Priority, dueDate?: string) => void;
}

export default function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority, dueDate || undefined);
    setText("");
    setPriority("medium");
    setDueDate("");
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#D97757] focus:bg-white focus:ring-2 focus:ring-[#D97757]/20"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="할일을 입력하세요"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="rounded-lg bg-[#D97757] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#c96647] active:scale-95"
        >
          추가
        </button>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          aria-label="마감일"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-600 outline-none transition-all duration-200 focus:border-[#D97757] focus:bg-white"
        />
        <div className="ml-auto flex gap-1" role="group" aria-label="우선순위">
          {priorities.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={priority === p}
              onClick={() => setPriority(p)}
              className={`rounded-full border px-3 py-1 text-xs transition-all duration-200 active:scale-95 ${
                priority === p
                  ? "border-[#D97757] bg-[#D97757] text-white"
                  : "border-gray-200 text-gray-600 hover:border-[#D97757] hover:text-[#D97757]"
              }`}
            >
              {priorityLabels[p]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
