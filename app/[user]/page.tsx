"use client";

import { useCallback, useEffect, useState } from "react";
import { Task } from "../lib/types/task";
import { getTasks } from "../lib/utils/api-client";
import TaskContainer from "./components/tasks/TaskContainer";
import NavBar from "./components/ui/navbar";
import ListTasks from "./components/tasks/ListTasks";

type FetchStatus = "idle" | "loading" | "error";

export default function UserTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [message, setMessage] = useState<string>("");

  const loadTasks = useCallback(async () => {
    setStatus("loading");
    setMessage("");

    try {
      const result = await getTasks();
      setTasks(result);
      setStatus("idle");
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Unable to load tasks";
      setMessage(text);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const handle = Promise.resolve().then(() => loadTasks());

    return () => {
      handle.catch(() => undefined);
    };
  }, [loadTasks]);

  return (
    <section className="w-full flex flex-col gap-4 p-4 lg:p-8">
      {/* <NavBar />
      <TaskContainer onTaskCreated={loadTasks} /> */}

      <div className="rounded-3xl border border-slate-100 px-6 py-5 shadow-sm shadow-slate-200">
        {status === "loading" && (
          <p className="text-sm text-slate-500">Loading tasks…</p>
        )}

        {status === "error" && (
          <p className="text-sm font-medium text-rose-600">{message}</p>
        )}

        {/* {status === "idle" && <ListTasks tasks={tasks} />} */}
      </div>
    </section>
  );
}
