import { create } from 'zustand';
import { Task } from '../types/task';
import { getTasks, createTask as apiCreateTask } from '../utils/api-client';
import type { CreateTaskInput, TaskResponse } from '../schemas/task';

interface TaskState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'error' | 'done';
  error: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (taskData: CreateTaskInput) => Promise<TaskResponse>;
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
    // Optimistically add to state without refetching
    set((state) => ({
      tasks: [newTask, ...state.tasks],
    }));
    return newTask;
  },

  setTasks: (tasks) => set({ tasks }),
  
  clearError: () => set({ error: null }),
}));
