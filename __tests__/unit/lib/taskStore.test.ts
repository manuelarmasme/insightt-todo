import { useTaskStore } from '@/app/lib/stores/taskStore';
import * as apiClient from '@/app/lib/utils/api-client';

// Mock the API client
// This prevents real API calls during tests
jest.mock('@/app/lib/utils/api-client');

describe('Task Store', () => {
  // Reset the store before each test
  // This ensures tests don't affect each other
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    // Reset store to initial state
    useTaskStore.setState({
      tasks: [],
      status: 'idle',
      error: null,
    });
  });

  /**
   * TEST 1: Initial State
   * ====================
   * What it does: Verifies the store starts with correct default values
   * 
   * This is like checking if a new app installation is clean
   */
  it('should have correct initial state', () => {
    const state = useTaskStore.getState();

    expect(state.tasks).toEqual([]); // No tasks initially
    expect(state.status).toBe('idle'); // Not loading
    expect(state.error).toBeNull(); // No errors
  });

  /**
   * TEST 2: Fetch Tasks
   * ==================
   * What it does: Tests loading tasks from the API
   * 
   * Flow:
   * 1. Call fetchTasks()
   * 2. Status changes to 'loading'
   * 3. API is called
   * 4. Tasks are stored
   * 5. Status changes to 'done'
   */
  describe('fetchTasks', () => {
    it('should fetch and store tasks successfully', async () => {
      // Arrange: Create fake tasks that API will return
      const mockTasks = [
        {
          _id: '1',
          userId: 'user-123',
          title: 'Task 1',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '2',
          userId: 'user-123',
          title: 'Task 2',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock the API to return our fake tasks
      (apiClient.getTasks as jest.Mock).mockResolvedValue(mockTasks);

      // Act: Call the fetch action
      await useTaskStore.getState().fetchTasks();

      // Assert: Check if state updated correctly
      const state = useTaskStore.getState();
      expect(state.tasks).toEqual(mockTasks);
      expect(state.status).toBe('done');
      expect(state.error).toBeNull();
      expect(apiClient.getTasks).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch error', async () => {
      // Test error scenario
      const errorMessage = 'Failed to load tasks';
      (apiClient.getTasks as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await useTaskStore.getState().fetchTasks();

      const state = useTaskStore.getState();
      expect(state.status).toBe('error');
      expect(state.error).toBe(errorMessage);
      expect(state.tasks).toEqual([]); // Tasks should still be empty
    });
  });

  /**
   * TEST 3: Add Task (Optimistic Update)
   * ====================================
   * What it does: Tests creating a new task
   * 
   * Important: This uses "optimistic update"
   * - The UI updates BEFORE the server responds
   * - Makes the app feel faster
   * - If API fails, we can roll back
   */
  describe('addTask', () => {
    it('should add new task to the store', async () => {
      // Arrange: Create task data
      const newTaskInput = {
        title: 'New Test Task',
        completed: false,
      };

      const createdTask = {
        _id: '3',
        userId: 'user-123',
        ...newTaskInput,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock API to return the created task
      (apiClient.createTask as jest.Mock).mockResolvedValue(createdTask);

      // Act: Add the task
      await useTaskStore.getState().addTask(newTaskInput);

      // Assert: Check if task was added
      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0]).toEqual(createdTask);
      expect(state.tasks[0].title).toBe('New Test Task');
      expect(apiClient.createTask).toHaveBeenCalledWith(newTaskInput);
    });

    it('should add new task at the beginning of the list', async () => {
      // Test that new tasks appear at the top (newest first)
      
      // Set up existing tasks
      useTaskStore.setState({
        tasks: [
          {
            _id: '1',
            userId: 'user-123',
            title: 'Old Task',
            completed: false,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
        ],
      });

      const newTask = {
        _id: '2',
        userId: 'user-123',
        title: 'New Task',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (apiClient.createTask as jest.Mock).mockResolvedValue(newTask);

      await useTaskStore.getState().addTask({
        title: 'New Task',
        completed: false,
      });

      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(2);
      expect(state.tasks[0].title).toBe('New Task'); // New task first
      expect(state.tasks[1].title).toBe('Old Task'); // Old task second
    });
  });

  /**
   * TEST 4: Delete Task
   * ==================
   * What it does: Tests removing a task
   * 
   * This also uses optimistic update - removes from UI immediately
   */
  describe('deleteTask', () => {
    it('should remove task from the store', async () => {
      // Arrange: Set up tasks in store
      useTaskStore.setState({
        tasks: [
          {
            _id: '1',
            userId: 'user-123',
            title: 'Task 1',
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            _id: '2',
            userId: 'user-123',
            title: 'Task 2',
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      });

      (apiClient.deleteTask as jest.Mock).mockResolvedValue(undefined);

      // Act: Delete task with id '1'
      await useTaskStore.getState().deleteTask('1');

      // Assert: Check if task was removed
      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0]._id).toBe('2'); // Only task 2 remains
      expect(apiClient.deleteTask).toHaveBeenCalledWith('1');
    });
  });

  /**
   * TEST 5: Update Task
   * ==================
   * What it does: Tests editing a task's title
   */
  describe('updateTask', () => {
    it('should update task in the store', async () => {
      // Arrange
      useTaskStore.setState({
        tasks: [
          {
            _id: '1',
            userId: 'user-123',
            title: 'Original Title',
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      });

      (apiClient.updateTask as jest.Mock).mockResolvedValue(undefined);

      // Act: Update the title
      await useTaskStore.getState().updateTask('1', {
        title: 'Updated Title',
      });

      // Assert: Check if title changed
      const state = useTaskStore.getState();
      expect(state.tasks[0].title).toBe('Updated Title');
      expect(apiClient.updateTask).toHaveBeenCalledWith('1', {
        title: 'Updated Title',
      });
    });
  });

  /**
   * TEST 6: Toggle Task Complete
   * ============================
   * What it does: Tests marking a task as done/undone
   * 
   * This is the "Mark as Done" feature from your technical test requirement
   */
  describe('toggleTaskComplete', () => {
    it('should toggle task completion status', async () => {
      // Arrange: Task starts as incomplete
      useTaskStore.setState({
        tasks: [
          {
            _id: '1',
            userId: 'user-123',
            title: 'Task 1',
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      });

      (apiClient.updateTaskComplete as jest.Mock).mockResolvedValue(undefined);

      // Act: Mark as completed
      await useTaskStore.getState().toggleTaskComplete('1', true);

      // Assert: Check if status changed
      const state = useTaskStore.getState();
      expect(state.tasks[0].completed).toBe(true);
      expect(apiClient.updateTaskComplete).toHaveBeenCalledWith('1', true);
    });

    it('should update the updatedAt timestamp', async () => {
      // Verify that timestamp is updated when toggling
      const oldDate = new Date('2024-01-01');
      useTaskStore.setState({
        tasks: [
          {
            _id: '1',
            userId: 'user-123',
            title: 'Task 1',
            completed: false,
            createdAt: oldDate,
            updatedAt: oldDate,
          },
        ],
      });

      (apiClient.updateTaskComplete as jest.Mock).mockResolvedValue(undefined);

      await useTaskStore.getState().toggleTaskComplete('1', true);

      const state = useTaskStore.getState();
      // The updated date should be more recent than the old date
      expect(state.tasks[0].updatedAt.getTime()).toBeGreaterThan(
        oldDate.getTime()
      );
    });
  });

  /**
   * TEST 7: Reset Store (On Logout)
   * ===============================
   * What it does: Tests clearing all data when user logs out
   * 
   * Important for security and privacy:
   * - Clears all tasks
   * - Resets status
   * - Clears errors
   */
  describe('resetStore', () => {
    it('should reset store to initial state', () => {
      // Arrange: Fill store with data
      useTaskStore.setState({
        tasks: [
          {
            _id: '1',
            userId: 'user-123',
            title: 'Task 1',
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        status: 'done',
        error: 'Some error',
      });

      // Act: Reset everything
      useTaskStore.getState().resetStore();

      // Assert: Everything should be clean
      const state = useTaskStore.getState();
      expect(state.tasks).toEqual([]);
      expect(state.status).toBe('idle');
      expect(state.error).toBeNull();
    });
  });

  /**
   * TEST 8: Clear Error
   * ==================
   * What it does: Tests clearing error messages
   */
  describe('clearError', () => {
    it('should clear error state', () => {
      // Set an error
      useTaskStore.setState({ error: 'Test error' });

      // Clear it
      useTaskStore.getState().clearError();

      // Check it's gone
      const state = useTaskStore.getState();
      expect(state.error).toBeNull();
    });
  });
});
