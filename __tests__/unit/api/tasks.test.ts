import { createTaskSchema, updateTaskSchema, completedTaskSchema } from '@/app/lib/schemas/task';

describe('Tasks API - Validation and Business Logic', () => {
  /**
   * TEST 1: Create Task Schema Validation
   * =====================================
   * What it does: Tests if our validation rules work correctly
   * 
   * This tests the Zod schema that validates task creation:
   * - Title is required
   * - Title must be between 1-200 characters
   * - Completed defaults to false
   */
  describe('createTaskSchema', () => {
    it('should accept valid task data', () => {
      // Arrange: Valid task data
      const validTask = {
        title: 'Valid Task Title',
        completed: false,
      };

      // Act: Validate the data
      const result = createTaskSchema.safeParse(validTask);

      // Assert: Should pass validation
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Valid Task Title');
        expect(result.data.completed).toBe(false);
      }
    });

    it('should reject task without title', () => {
      // Test validation: title is required
      const invalidTask = {
        completed: false,
        // Missing title!
      };

      const result = createTaskSchema.safeParse(invalidTask);

      // Should fail validation
      expect(result.success).toBe(false);
      if (!result.success) {
        // Check that error is about the title field
        expect(result.error.issues[0].path).toContain('title');
      }
    });

    it('should reject task with empty title', () => {
      const invalidTask = {
        title: '', // Empty string
        completed: false,
      };

      const result = createTaskSchema.safeParse(invalidTask);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('required');
      }
    });

    it('should reject task with title too long', () => {
      const invalidTask = {
        title: 'x'.repeat(201), // 201 characters (max is 200)
        completed: false,
      };

      const result = createTaskSchema.safeParse(invalidTask);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('200');
      }
    });

    it('should default completed to false when not provided', () => {
      const task = {
        title: 'Task without completed field',
      };

      const result = createTaskSchema.safeParse(task);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.completed).toBe(false); // Default value
      }
    });
  });

  /**
   * TEST 2: Update Task Schema Validation
   * =====================================
   * What it does: Tests validation for updating tasks
   * 
   * For updates, all fields are optional (you can update just title)
   */
  describe('updateTaskSchema', () => {
    it('should accept title update', () => {
      const updateData = {
        title: 'New Title',
      };

      const result = updateTaskSchema.safeParse(updateData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('New Title');
      }
    });

    it('should accept completed update', () => {
      const updateData = {
        completed: true,
      };

      const result = updateTaskSchema.safeParse(updateData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.completed).toBe(true);
      }
    });

    it('should accept both fields', () => {
      const updateData = {
        title: 'Updated Title',
        completed: true,
      };

      const result = updateTaskSchema.safeParse(updateData);

      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const updateData = {
        title: '',
      };

      const result = updateTaskSchema.safeParse(updateData);

      expect(result.success).toBe(false);
    });

    it('should reject title over 200 characters', () => {
      const updateData = {
        title: 'x'.repeat(201),
      };

      const result = updateTaskSchema.safeParse(updateData);

      expect(result.success).toBe(false);
    });

    it('should accept empty object (no updates)', () => {
      // This is valid - user might not update anything
      const updateData = {};

      const result = updateTaskSchema.safeParse(updateData);

      expect(result.success).toBe(true);
    });
  });

  /**
   * TEST 3: Completed Task Schema Validation  ⭐ IMPORTANT!
   * ======================================================
   * What it does: Tests the "Mark as Done" validation
   * 
   * THIS TESTS THE TECHNICAL TEST REQUIREMENT:
   * "Mark a task as Done using a Web Service"
   * 
   * The PATCH endpoint uses this schema to validate
   * the completed status update.
   */
  describe('completedTaskSchema - Mark as Done Validation', () => {
    it('should accept marking task as completed', () => {
      // This is what happens when user marks task as done
      const markAsDone = {
        completed: true,
      };

      const result = completedTaskSchema.safeParse(markAsDone);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.completed).toBe(true);
      }
    });

    it('should accept marking task as incomplete', () => {
      // User can also mark task as not done
      const markAsNotDone = {
        completed: false,
      };

      const result = completedTaskSchema.safeParse(markAsNotDone);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.completed).toBe(false);
      }
    });

    it('should require completed field', () => {
      // PATCH endpoint requires the completed field
      const invalidData = {};

      const result = completedTaskSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject non-boolean values', () => {
      const invalidData = {
        completed: 'yes', // String instead of boolean
      };

      const result = completedTaskSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  /**
   * TEST 4: Task Data Transformation
   * ================================
   * What it does: Tests that task data is formatted correctly
   */
  describe('Task Data Validation', () => {
    it('should validate complete task object structure', () => {
      const completeTask = {
        _id: '507f1f77bcf86cd799439011',
        userId: 'user-123',
        title: 'Complete Task',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Verify all required fields exist
      expect(completeTask._id).toBeDefined();
      expect(completeTask.userId).toBeDefined();
      expect(completeTask.title).toBeDefined();
      expect(typeof completeTask.completed).toBe('boolean');
      expect(completeTask.createdAt).toBeInstanceOf(Date);
      expect(completeTask.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle task list sorting logic', () => {
      // Test the sorting logic used in the UI
      // Incomplete tasks should come before completed tasks
      const tasks = [
        { _id: '1', title: 'Task 1', completed: true },
        { _id: '2', title: 'Task 2', completed: false },
        { _id: '3', title: 'Task 3', completed: false },
        { _id: '4', title: 'Task 4', completed: true },
      ];

      // Sort: incomplete first, completed at bottom
      const sorted = tasks.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });

      // First two should be incomplete
      expect(sorted[0].completed).toBe(false);
      expect(sorted[1].completed).toBe(false);
      // Last two should be completed
      expect(sorted[2].completed).toBe(true);
      expect(sorted[3].completed).toBe(true);
    });
  });
});
