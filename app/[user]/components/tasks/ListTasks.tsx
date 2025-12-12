"use client";

import { Task } from "../../../lib/types/task";

interface ListTasksProps {
  tasks: Task[];
}

export default function ListTasks({ tasks }: ListTasksProps) {
  if (tasks.length === 0) {
    return (
      <section className="p-4 rounded border border-dashed border-slate-300">
        <p className="text-sm text-slate-500">
          No tasks yet — create one to get started.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {tasks.map((task) => (
        <article
          key={task._id}
          className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-indigo-50"
        >
          <header className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              {task.title}
            </h3>
            <span
              className={`text-xs font-medium uppercase tracking-wide ${
                task.completed ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {task.completed ? "Completed" : "Open"}
            </span>
          </header>

          {task.description && (
            <p className="mt-2 text-sm text-slate-600">{task.description}</p>
          )}

          <footer className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Created {task.createdAt.toLocaleString()}</span>
            <span>Updated {task.updatedAt.toLocaleString()}</span>
          </footer>
        </article>
      ))}
    </section>
  );
}
