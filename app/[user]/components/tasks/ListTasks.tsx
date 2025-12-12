import { Box } from "@mui/material";
import { Task } from "../../../lib/types/task";
import DeleteTaskDialog from "./DeleteTaskDialog";
import ToggleTaskComplete from "./ToggleTaskComplete";
import EditTaskDialog from "./EditTaskDialog";

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

  // Sort tasks: incomplete first, completed at bottom
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <>
      <Box
        sx={{
          maxHeight: "480px",
          overflowY: "auto",
          pr: 1,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(148, 163, 184, 0.5)",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "rgba(148, 163, 184, 0.7)",
            },
          },
        }}
      >
        <section className="space-y-3">
          {sortedTasks.map((task) => (
            <ul
              key={task._id}
              className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-indigo-50"
            >
              <li className="flex items-center justify-between">
                <h2
                  className={`text-lg font-semibold line-clamp-2 truncate ${
                    task.completed ? "text-emerald-600" : "text-slate-900"
                  }`}
                >
                  {task.title}
                </h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium uppercase tracking-wide ${
                      task.completed ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {task.completed ? "Completed" : "Open"}
                  </span>
                  <ToggleTaskComplete
                    taskId={task._id}
                    completed={task.completed}
                  />
                  <EditTaskDialog task={task} />
                  <DeleteTaskDialog taskId={task._id} />
                </div>
              </li>
            </ul>
          ))}
        </section>
      </Box>
    </>
  );
}
