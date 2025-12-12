import { z } from 'zod';

// Schema for creating a new task
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  completed: z.boolean().optional().default(false)
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  completed: z.boolean().optional()
});

export const completedTaskSchema = z.object({
  completed: z.boolean()
});

// Schema for task response from database
export const taskResponseSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Schema for list of tasks response
export const tasksListResponseSchema = z.object({
  tasks: z.array(taskResponseSchema)
});

// Schema for API error response
export const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional()
});

// Type exports
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type TaskResponse = z.infer<typeof taskResponseSchema>;
export type TasksListResponse = z.infer<typeof tasksListResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
