"use client";

import { Filter } from "@/lib/types";

const filters: { label: string; value: Filter }[] = [
  { label: "전체", value: "all" },
  { label: "진행중", value: "active" },
  { label: "완료", value: "completed" },
];

interface Props {
  filter: Filter;
  onChange: (filter: Filter) => void;
}

export default function FilterBar({ filter, onChange }: Props) {
  return (
    <div className="flex gap-2 px-4 pb-2">
      {filters.map((f) => (
        <button
          key={f.value}
          type="button"
          aria-pressed={filter === f.value}
          onClick={() => onChange(f.value)}
          className={`rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200 active:scale-95 ${
            filter === f.value
              ? "border-[#D97757] bg-[#D97757] text-white"
              : "border-gray-200 text-gray-600 hover:border-[#D97757] hover:text-[#D97757]"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
