import CreateTaskForm from "./CreateTaskForm";

interface TaskContainerProps {
  onTaskCreated?: () => void;
}

export default function TaskContainer({ onTaskCreated }: TaskContainerProps) {
  return <CreateTaskForm onTaskCreated={onTaskCreated} />;
}
