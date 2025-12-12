import { test, expect } from '@playwright/test';

/**
 * Test Setup: Authentication
 * ==========================
 * These tests assume the user is already logged in.
 * In Playwright, we can use "beforeEach" to login before each test.
 */

test.describe('Task CRUD Operations', () => {
  /**
   * This runs BEFORE EACH test
   * =========================
   * It logs in the user so every test starts with an authenticated state
   * 
   * NOTE: For this to work, you need to provide real test credentials
   */
  test.beforeEach(async ({ page }) => {
    // TODO: Add real test credentials to enable E2E testing
    await page.goto('/');
    
    // Skip login for now - tests will be skipped
    // await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    // await page.getByLabel(/password/i).fill('testpassword');
    // await page.getByRole('button', { name: /sign in/i }).click();
    // await page.waitForURL(/\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/);
  });

  /**
   * TEST 1: Create a New Task
   * ========================
   * What it does: Tests if a user can create a task
   * 
   * Steps:
   * 1. Find the task input field
   * 2. Type a task title
   * 3. Click create button
   * 4. Verify task appears in the list
   */
  test.skip('should create a new task', async ({ page}) => {
    // Already on tasks page from beforeEach login
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('input', { timeout: 10000 });

    // Find the input field for creating tasks
    // This looks for an input with label "Task Title"
    const taskInput = page.getByLabel(/task title/i);
    await expect(taskInput).toBeVisible();

    // Type a task name
    const taskTitle = `Test Task ${Date.now()}`; // Unique name using timestamp
    await taskInput.fill(taskTitle);

    // Click the create button (the + icon button)
    const createButton = page.getByRole('button', { name: /add/i });
    await createButton.click();

    // Wait for the task to appear
    await page.waitForTimeout(1000);

    // Verify the task appears in the list
    await expect(page.getByText(taskTitle)).toBeVisible();

    // Screenshot showing the new task
    await page.screenshot({ 
      path: './__tests__/e2e/screenshots/task-created.png' 
    });
  });

  /**
   * TEST 2: View Tasks List
   * ======================
   * What it does: Verifies that tasks are displayed correctly
   */
  test.skip('should display tasks list', async ({ page }) => {
    // Already on tasks page from beforeEach login
    await page.waitForLoadState('domcontentloaded');

    // Check if the tasks container exists
    // Even if there are no tasks, the container should exist
    const tasksSection = page.locator('section');
    await expect(tasksSection).toBeVisible();

    // Take a screenshot of the tasks list
    await page.screenshot({ 
      path: './__tests__/e2e/screenshots/tasks-list.png' 
    });
  });

  /**
   * TEST 3: Edit a Task
   * ==================
   * What it does: Tests editing a task's title
   * 
   * This is complex because it involves:
   * 1. Creating a task first
   * 2. Finding the edit button
   * 3. Opening the edit dialog
   * 4. Changing the title
   * 5. Saving changes
   * 6. Verifying the update
   */
  test.skip('should edit a task', async ({ page }) => {
    // Already on tasks page from beforeEach login
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('input', { timeout: 10000 });

    // Create a task first
    const originalTitle = `Original Task ${Date.now()}`;
    await page.getByLabel(/task title/i).fill(originalTitle);
    await page.getByRole('button', { name: /add/i }).click();
    await page.waitForTimeout(1000);

    // Find the task we just created
    const taskCard = page.getByText(originalTitle).locator('..');
    
    // Find and click the edit button within this task
    // The edit button should be an icon button with EditIcon
    const editButton = taskCard.getByRole('button').filter({ 
      has: page.locator('[data-testid="EditIcon"]') 
    }).first();
    await editButton.click();

    // Wait for the edit dialog to appear
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/edit task/i)).toBeVisible();

    // Find the input field in the dialog and change the title
    const updatedTitle = `Updated Task ${Date.now()}`;
    const dialogInput = page.getByRole('dialog').getByLabel(/task title/i);
    await dialogInput.clear();
    await dialogInput.fill(updatedTitle);

    // Click the Save button
    await page.getByRole('button', { name: /save/i }).click();

    // Wait for dialog to close and task to update
    await page.waitForTimeout(1000);

    // Verify the task title changed
    await expect(page.getByText(updatedTitle)).toBeVisible();
    await expect(page.getByText(originalTitle)).not.toBeVisible();

    // Screenshot after editing
    await page.screenshot({ 
      path: './__tests__/e2e/screenshots/task-edited.png' 
    });
  });

  /**
   * TEST 4: Mark Task as Done (IMPORTANT!)
   * =====================================
   * What it does: Tests the "Mark as Done" feature
   * 
   * THIS IS CRUCIAL FOR YOUR TECHNICAL TEST!
   * The requirement specifically asks for:
   * "Mark a task as Done using a Web Service"
   * 
   * This test verifies:
   * - User can click the complete button
   * - Task status changes visually
   * - Task moves to the bottom of the list
   * - Task title turns green (as per your implementation)
   */
  test.skip('should mark task as done', async ({ page }) => {
    // Already on tasks page from beforeEach login
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('input', { timeout: 10000 });

    // Create a task first
    const taskTitle = `Task to Complete ${Date.now()}`;
    await page.getByLabel(/task title/i).fill(taskTitle);
    await page.getByRole('button', { name: /add/i }).click();
    await page.waitForTimeout(1000);

    // Find the task
    const taskCard = page.getByText(taskTitle).locator('..');

    // Verify task shows "Open" status initially
    await expect(taskCard.getByText(/open/i)).toBeVisible();

    // Find and click the toggle complete button (CheckCircle icon)
    const toggleButton = taskCard.getByRole('button').filter({
      has: page.locator('[data-testid="CheckCircleOutlineIcon"], [data-testid="CheckCircleIcon"]')
    }).first();
    await toggleButton.click();

    // Wait for the update
    await page.waitForTimeout(1000);

    // Verify task status changed to "Completed"
    await expect(taskCard.getByText(/completed/i)).toBeVisible();

    // Verify the task title is now green (has the green text class)
    const taskTitleElement = page.getByText(taskTitle);
    
    // Check if title has green color class
    // Your implementation uses: text-emerald-600
    const titleClasses = await taskTitleElement.getAttribute('class');
    expect(titleClasses).toContain('text-emerald-600');

    // Screenshot showing completed task
    await page.screenshot({ 
      path: './__tests__/e2e/screenshots/task-completed.png' 
    });
  });

  /**
   * TEST 5: Delete a Task
   * ====================
   * What it does: Tests deleting a task with confirmation
   * 
   * This tests:
   * - Delete button works
   * - Confirmation dialog appears
   * - User can confirm deletion
   * - Task disappears from list
   */
  test.skip('should delete a task', async ({ page }) => {
    // Already on tasks page from beforeEach login
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('input', { timeout: 10000 });

    // Create a task to delete
    const taskTitle = `Task to Delete ${Date.now()}`;
    await page.getByLabel(/task title/i).fill(taskTitle);
    await page.getByRole('button', { name: /add/i }).click();
    await page.waitForTimeout(1000);

    // Verify task exists
    await expect(page.getByText(taskTitle)).toBeVisible();

    // Find the task card
    const taskCard = page.getByText(taskTitle).locator('..');

    // Find and click the delete button (trash icon)
    const deleteButton = taskCard.getByRole('button').filter({
      has: page.locator('[data-testid="DeleteIcon"]')
    }).first();
    await deleteButton.click();

    // Wait for confirmation dialog
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/delete task/i)).toBeVisible();
    await expect(page.getByText(/are you sure/i)).toBeVisible();

    // Screenshot of confirmation dialog
    await page.screenshot({ 
      path: './__tests__/e2e/screenshots/delete-confirmation.png' 
    });

    // Click the Delete button in the dialog (red button)
    const confirmDeleteButton = page.getByRole('dialog')
      .getByRole('button', { name: /delete/i });
    await confirmDeleteButton.click();

    // Wait for task to be removed
    await page.waitForTimeout(1000);

    // Verify task is gone
    await expect(page.getByText(taskTitle)).not.toBeVisible();

    // Screenshot after deletion
    await page.screenshot({ 
      path: './__tests__/e2e/screenshots/task-deleted.png' 
    });
  });

  /**
   * TEST 6: Complete CRUD Flow (All Together)
   * =========================================
   * What it does: Tests all operations in sequence
   * 
   * This is a comprehensive test that:
   * 1. Creates a task
   * 2. Edits it
   * 3. Marks it as done
   * 4. Deletes it
   * 
   * This proves the entire system works end-to-end!
   */
  test.skip('should complete full CRUD workflow', async ({ page }) => {
    // Already on tasks page from beforeEach login
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('input', { timeout: 10000 });

    const timestamp = Date.now();

    // 1. CREATE
    const originalTitle = `Full CRUD Test ${timestamp}`;
    await page.getByLabel(/task title/i).fill(originalTitle);
    await page.getByRole('button', { name: /add/i }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText(originalTitle)).toBeVisible();
    console.log('✓ Task created');

    // 2. EDIT
    let taskCard = page.getByText(originalTitle).locator('..');
    const editButton = taskCard.getByRole('button').filter({
      has: page.locator('[data-testid="EditIcon"]')
    }).first();
    await editButton.click();
    
    const updatedTitle = `Full CRUD Test Updated ${timestamp}`;
    const dialogInput = page.getByRole('dialog').getByLabel(/task title/i);
    await dialogInput.clear();
    await dialogInput.fill(updatedTitle);
    await page.getByRole('button', { name: /save/i }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText(updatedTitle)).toBeVisible();
    console.log('✓ Task edited');

    // 3. MARK AS DONE
    taskCard = page.getByText(updatedTitle).locator('..');
    const toggleButton = taskCard.getByRole('button').filter({
      has: page.locator('[data-testid="CheckCircleOutlineIcon"], [data-testid="CheckCircleIcon"]')
    }).first();
    await toggleButton.click();
    await page.waitForTimeout(1000);
    await expect(taskCard.getByText(/completed/i)).toBeVisible();
    console.log('✓ Task marked as done');

    // 4. DELETE
    const deleteButton = taskCard.getByRole('button').filter({
      has: page.locator('[data-testid="DeleteIcon"]')
    }).first();
    await deleteButton.click();
    await page.getByRole('dialog')
      .getByRole('button', { name: /delete/i })
      .click();
    await page.waitForTimeout(1000);
    await expect(page.getByText(updatedTitle)).not.toBeVisible();
    console.log('✓ Task deleted');

    // Final screenshot
    await page.screenshot({ 
      path: './__tests__/e2e/screenshots/full-crud-complete.png' 
    });

    console.log('✓✓✓ Full CRUD workflow completed successfully!');
  });

  /**
   * TEST 7: Completed Tasks Sorting
   * ===============================
   * What it does: Verifies completed tasks move to bottom
   */
  test.skip('should move completed tasks to bottom of list', async ({ page }) => {
    // Already on tasks page from beforeEach login
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('input', { timeout: 10000 });

    // Create two tasks
    const task1 = `Task One ${Date.now()}`;
    await page.getByLabel(/task title/i).fill(task1);
    await page.getByRole('button', { name: /add/i }).click();
    await page.waitForTimeout(500);

    const task2 = `Task Two ${Date.now() + 1}`;
    await page.getByLabel(/task title/i).fill(task2);
    await page.getByRole('button', { name: /add/i }).click();
    await page.waitForTimeout(1000);

    // Get all task titles in order
    const tasksBefore = await page.locator('h2').allTextContents();
    const index1Before = tasksBefore.findIndex(t => t.includes(task1));
    const index2Before = tasksBefore.findIndex(t => t.includes(task2));

    // Task 2 should be before Task 1 (newest first)
    expect(index2Before).toBeLessThan(index1Before);

    // Mark Task 2 as complete
    const task2Card = page.getByText(task2).locator('..');
    const toggleButton = task2Card.getByRole('button').filter({
      has: page.locator('[data-testid="CheckCircleOutlineIcon"]')
    }).first();
    await toggleButton.click();
    await page.waitForTimeout(1000);

    // Get order again
    const tasksAfter = await page.locator('h2').allTextContents();
    const index1After = tasksAfter.findIndex(t => t.includes(task1));
    const index2After = tasksAfter.findIndex(t => t.includes(task2));

    // Task 1 should now be before Task 2 (incomplete before complete)
    expect(index1After).toBeLessThan(index2After);

    await page.screenshot({ 
      path: './__tests__/e2e/screenshots/tasks-sorted.png' 
    });
  });
});
