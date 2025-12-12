import { fetchAuthSession } from 'aws-amplify/auth';
import { createTaskSchema, type CreateTaskInput, type TaskResponse } from '@/app/lib/schemas/task';
import { Task } from '../types/task';

/**
 * Get the current user's authentication token
 * Calls fetchAuthSession which automatically refreshes expired tokens
 */
async function getAuthToken(): Promise<string> {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    
    
    if (!idToken) {
      throw new Error('No authentication token available');
    }
    
    return idToken;
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw new Error('Authentication required. Please sign in.');
  }
}

/**
 * Helper function to make authenticated API requests
 */
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken();
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create a new task
 * @param data - Task data (title, description, completed)
 * @returns The created task
 */
export async function createTask(data: CreateTaskInput): Promise<TaskResponse> {
  // Validate input on client side
  const validatedData = createTaskSchema.parse(data);
  
  const response = await fetchWithAuth('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(validatedData),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to create task' }));
    throw new Error(error.error || 'Failed to create task');
  }
  
  const result = await response.json();
  return result.task;
}

/**
 * Get all tasks for the current user
 * @returns Array of tasks
 */
export async function getTasks(): Promise<TaskResponse[]> {
  const response = await fetchWithAuth('/api/tasks', {
    method: 'GET',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch tasks' }));
    throw new Error(error.error || 'Failed to fetch tasks');
  }
  
  const result = await response.json();
  
  // Transform date strings back to Date objects
  return result.tasks.map((task: Task) => ({
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
  }));
}

/**
 * Update task completion status
 * @param taskId - The ID of the task to update
 * @param completed - The new completion status
 */
export async function updateTaskComplete(taskId: string, completed: boolean): Promise<void> {
  const response = await fetchWithAuth(`/api/tasks?id=${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to update task' }));
    throw new Error(error.error || 'Failed to update task');
  }
}

/**
 * Delete a task
 * @param taskId - The ID of the task to delete
 */
export async function deleteTask(taskId: string): Promise<void> {
  const response = await fetchWithAuth(`/api/tasks?id=${taskId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to delete task' }));
    throw new Error(error.error || 'Failed to delete task');
  }
}

/**
 * Handle API errors and check if user needs to re-authenticate
 */
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('Authentication required')) {
      // Redirect to login or show auth modal
      window.location.href = '/';
      return 'Please sign in to continue';
    }
    return error.message;
  }
  return 'An unexpected error occurred';
}
