import { Priority, Todo } from "@/lib/types";

// 날짜 문자열을 보기 좋게 바꿔주는 함수
export function fd(d: string) {
  let result = "";
  const x = new Date(d);
  const y = x.getFullYear();
  const m = x.getMonth() + 1;
  const dd = x.getDate();
  if (m < 10) {
    result = result + y + "년 " + "0" + m + "월 ";
  } else {
    result = result + y + "년 " + m + "월 ";
  }
  if (dd < 10) {
    result = result + "0" + dd + "일";
  } else {
    result = result + dd + "일";
  }
  return result;
}

export const priorityLabels: Record<Priority, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

// 마감일이 빠른 순으로 정렬 (마감일 없는 할일은 맨 뒤, 마감일이 같으면 우선순위 높은 순)
export function sortByDueDate(todos: Todo[]) {
  return [...todos].sort((a, b) => {
    if (a.dueDate !== b.dueDate) {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

export function countRemaining(todos: Todo[]) {
  return todos.length;
}
