import { test, expect } from '@playwright/test';

/**
 * NOTE ABOUT THIS TEST:
 * ====================
 * This test requires real AWS Cognito credentials to work.
 * For demo purposes, I'm showing the structure.
 * 
 * In a real scenario, you would either:
 * 1. Use test credentials provided by your team
 * 2. Mock the authentication in development
 * 3. Use environment variables for credentials
 * 
 * For your technical test submission, you can:
 * - Show this test structure (demonstrates you understand E2E)
 * - Comment it out if you don't want to expose credentials
 * - Or create a simple test that just checks the login page loads
 */

test.describe('Authentication Flow', () => {
  /**
   * TEST 1: Login Page Loads
   * ========================
   * What it does: Verifies the login page appears when visiting the app
   * 
   * This is the simplest E2E test - just checks if the page loads
   */
  test('should display login page', async ({ page }) => {
    // Navigate to the app
    // page.goto() tells Playwright to visit a URL
    await page.goto('/');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Check if we see login-related elements
    // We look for the Sign In heading on the login page
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    
    // Check for email input field
    // getByRole finds elements by their semantic role (good for accessibility)
    await expect(
      page.getByRole('textbox', { name: /email/i })
    ).toBeVisible();

    // Check for password input
    await expect(page.getByLabel(/password/i)).toBeVisible();

    // Take a screenshot (useful for debugging)
    await page.screenshot({ path: './__tests__/e2e/screenshots/login-page.png' });
  });

  /**
   * TEST 2: Full Login Flow
   * =======================
   * What it does: Simulates a complete user login
   * 
   * NOTE: Test credentials have been removed for security
   */
  test.skip('should allow user to login successfully', async ({ page }) => {
    // TODO: Add test credentials
    const testEmail = 'test@example.com';
    const testPassword = 'testpassword';

    // Step 1: Go to the app
    await page.goto('/');

    // Step 2: Fill in the email
    // This simulates typing in the email field
    await page.getByRole('textbox', { name: /email/i }).fill(testEmail);

    // Step 3: Fill in the password
    await page.getByLabel(/password/i).fill(testPassword);

    // Step 4: Click the login button
    // This simulates clicking the "Sign In" button
    await page.getByRole('button', { name: /sign in|login/i }).click();

    // Step 5: Wait for navigation
    // After successful login, AWS Cognito redirects to a UUID-based URL
    // Example: /a10b55c0-90d1-701d-f6a9-60097fbf1ad0
    await page.waitForURL(/\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/, { timeout: 10000 });

    // Step 6: Verify we're on the dashboard
    // Check if we see elements that only appear after login
    await expect(page.getByRole('heading', { name: /my todo app/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();

    // Screenshot of successful login
    await page.screenshot({ 
      path: './__tests__/e2e/screenshots/logged-in.png' 
    });
  });

  /**
   * TEST 3: Logout Flow
   * ==================
   * What it does: Tests if user can log out successfully
   * 
   * This assumes you're already logged in from the previous test
   */
  test.skip('should allow user to logout', async ({ page }) => {
    // First login
    await page.goto('/');
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByLabel(/password/i).fill('testpassword');
    await page.getByRole('button', { name: /sign in|login/i }).click();
    await page.waitForURL(/\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/, { timeout: 10000 });

    // Now logout
    await page.getByRole('button', { name: /logout/i }).click();

    // Wait for redirect back to login page
    await page.waitForURL('/', { timeout: 5000 });

    // Verify we're back at the login page
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();

    // Screenshot after logout
    await page.screenshot({ 
      path: './__tests__/e2e/screenshots/logged-out.png' 
    });
  });

  /**
   * TEST 4: Invalid Credentials
   * ===========================
   * What it does: Tests error handling when credentials are wrong
   */
  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/');

    // Try to login with fake credentials
    await page.getByRole('textbox', { name: /email/i }).fill('fake@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in|login/i }).click();

    // Wait a bit for error message to appear
    await page.waitForTimeout(2000);

    // We should see an error message
    // The exact text depends on your error handling
    // This checks if we're still on the login page (didn't redirect)
    await expect(page).toHaveURL('/');

    // Screenshot of error state
    await page.screenshot({ 
      path: './__tests__/e2e/screenshots/login-error.png' 
    });
  });

  /**
   * TEST 5: Protected Route Access
   * ==============================
   * What it does: Verifies that logged-out users can't access protected pages
   */
  test('should redirect to login when accessing protected route', async ({ page }) => {
    // Try to directly access the user dashboard without logging in
    await page.goto('/user');

    // Should be redirected back to login
    // Or show a "not authorized" message
    await page.waitForLoadState('networkidle');

    // Verify we can't see the dashboard
    const url = page.url();
    expect(url).not.toContain('/user');
  });
});

/**
 * HOW TO RUN THESE TESTS:
 * =======================
 * 
 * 1. Make sure your dev server is running (or tests will start it automatically)
 * 2. Run: pnpm playwright test
 * 3. View report: pnpm playwright show-report
 * 
 * TIPS:
 * =====
 * - Use test.only() to run just one test
 * - Use test.skip() to skip a test
 * - Add { headless: false } in playwright.config.ts to see the browser
 * - Screenshots are saved automatically on failure
 */
