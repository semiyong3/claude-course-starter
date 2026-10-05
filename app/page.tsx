"use client";

import { useState } from "react";
import Header from "@/components/Header";
import TodoInput from "@/components/TodoInput";
import FilterBar from "@/components/FilterBar";
import TodoList from "@/components/TodoList";
import { mockTodos } from "@/lib/mock-data";
import { Filter, Priority, Todo } from "@/lib/types";
import { sortByDueDate } from "@/lib/utils";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [filter, setFilter] = useState<Filter>("all");

  const visibleTodos = sortByDueDate(
    todos.filter((t) =>
      filter === "active"
        ? !t.completed
        : filter === "completed"
          ? t.completed
          : true,
    ),
  );

  const addTodo = (text: string, priority: Priority, dueDate?: string) => {
    const newTodo: Todo = {
      id: String(Date.now()),
      text,
      completed: false,
      createdAt: new Date().toISOString().slice(0, 10),
      dueDate,
      priority,
    };
    setTodos([newTodo, ...todos]);
    console.log("할일 추가됨:", text);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <>
      <Header todos={todos} />
      <TodoInput onAdd={addTodo} />
      <FilterBar filter={filter} onChange={setFilter} />
      <TodoList todos={visibleTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </>
  );
}
