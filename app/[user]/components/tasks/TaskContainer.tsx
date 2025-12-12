"use client";
import { useEffect } from "react";
import CreateTaskForm from "./CreateTaskForm";
import { useTaskStore } from "@/app/lib/stores/taskStore";
import ListTasks from "./ListTasks";
import Loading from "../../loading";

export default function TaskContainer() {
  const { tasks, status, error, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <section className="flex flex-col gap-4">
      {(status === "loading" || status === "idle") && (
        <Loading message="Loading your tasks..." />
      )}

      {status === "error" && (
        <p className="text-sm font-medium text-rose-600">{error}</p>
      )}

      {status === "done" && (
        <>
          <CreateTaskForm />
          <div className="rounded-3xl border border-slate-100 px-6 py-5 shadow-sm shadow-slate-200">
            <ListTasks tasks={tasks} />
          </div>
        </>
      )}
    </section>
  );
}
