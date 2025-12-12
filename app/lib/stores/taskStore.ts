import { create } from 'zustand';
import { Task } from '../types/task';
import { getTasks, createTask as apiCreateTask, deleteTask as apiDeleteTask, updateTaskComplete as apiUpdateTaskComplete } from '../utils/api-client';
import type { CreateTaskInput, TaskResponse } from '../schemas/task';

interface TaskState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'error' | 'done';
  error: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (taskData: CreateTaskInput) => Promise<TaskResponse>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskComplete: (taskId: string, completed: boolean) => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  status: 'idle',
  error: null,

  fetchTasks: async () => {
    set({ status: 'loading', error: null });
    try {
      const tasks = await getTasks();
      set({ tasks, status: 'done' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load tasks';
      set({ error: message, status: 'error' });
    }
  },

  addTask: async (taskData) => {
    const newTask = await apiCreateTask(taskData);

    set((state) => ({
      tasks: [newTask, ...state.tasks],
    }));
    return newTask;
  },

  deleteTask: async (taskId) => {
    await apiDeleteTask(taskId);

    set((state) => ({
      tasks: state.tasks.filter(task => task._id !== taskId),
    }));
  },

  toggleTaskComplete: async (taskId, completed) => {
    await apiUpdateTaskComplete(taskId, completed);

    set((state) => ({
      tasks: state.tasks.map(task => 
        task._id === taskId 
          ? { ...task, completed, updatedAt: new Date() }
          : task
      ),
    }));
  },

  setTasks: (tasks) => set({ tasks }),
  
  clearError: () => set({ error: null }),
}));
