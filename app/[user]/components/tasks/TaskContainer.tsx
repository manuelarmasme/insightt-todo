"use client";
import { useEffect } from "react";
import CreateTaskForm from "./CreateTaskForm";
import { useTaskStore } from "@/app/lib/stores/taskStore";
import ListTasks from "./ListTasks";
import Loading from "../ui/loading";
import { Card } from "@mui/material";
import Error from "../ui/error";

export default function TaskContainer() {
  const { tasks, status, error, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <section className="flex flex-col gap-4 h-full">
      {(status === "loading" || status === "idle") && (
        <Loading message="Loading your tasks..." />
      )}

      {status === "error" && <Error message={"An unknown error occurred."} />}

      {status === "done" && (
        <>
          <CreateTaskForm />
          <Card className="rounded-3xl h-full border border-slate-100 px-6 py-5 shadow-sm shadow-slate-200">
            <h1 className="text-2xl font-semibold mb-4">My Tasks</h1>
            <ListTasks tasks={tasks} />
          </Card>
        </>
      )}
    </section>
  );
}
