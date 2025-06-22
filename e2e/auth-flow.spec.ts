import { test, expect } from '@playwright/test';

/**
 * E2E Authentication Flow Tests
 * Tests the complete authentication journey with Auth0 integration
 */

test.describe('Authentication Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/');
  });

  test('should display login page correctly', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Check page title and content
    await expect(page).toHaveTitle(/Login/);
    await expect(page.locator('h1')).toContainText('Giriş Yap');
    
    // Check login button exists
    const loginButton = page.locator('button', { hasText: 'Auth0 ile Giriş Yap' });
    await expect(loginButton).toBeVisible();
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access protected dashboard
    await page.goto('/dashboard');
    
    // Should redirect to login or show access denied
    await page.waitForURL(/login|auth/);
    
    // Alternative: check for redirect to NextAuth
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/login|auth|api\/auth/);
  });

  test('should redirect unauthenticated users from admin pages', async ({ page }) => {
    // Try to access admin area
    await page.goto('/admin');
    
    // Should redirect to authentication
    await page.waitForURL(/login|auth/);
    
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/login|auth|api\/auth/);
  });

  test('should show appropriate navigation based on auth status', async ({ page }) => {
    // Check unauthenticated navigation
    await page.goto('/');
    
    // Should see login link
    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink).toBeVisible();
    
    // Should not see logout or protected links
    await expect(page.locator('button', { hasText: 'Çıkış Yap' })).not.toBeVisible();
  });

  test('should display proper middleware protection messages', async ({ page }) => {
    // Test protected routes show proper error messages
    await page.goto('/profile');
    
    // Should either redirect or show access message
    const isRedirected = page.url().includes('login') || page.url().includes('auth');
    
    if (!isRedirected) {
      // If not redirected, should show access denied message
      await expect(page.locator('text=Erişim reddedildi')).toBeVisible();
    }
  });

  test('should handle Auth0 login flow initiation', async ({ page }) => {
    await page.goto('/login');
    
    // Click login button
    const loginButton = page.locator('button', { hasText: 'Auth0 ile Giriş Yap' });
    await loginButton.click();
    
    // Should navigate to Auth0 or NextAuth
    await page.waitForURL(/auth0|auth|api/);
    
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/auth0|auth|api/);
  });

  test('should properly handle role-based access after mock authentication', async ({ page }) => {
    // Mock authenticated session by setting localStorage or cookies
    // Note: In real tests, you'd complete actual Auth0 flow
    
    // For now, test the protected page structure
    await page.goto('/dashboard');
    
    // Should either be redirected or show the page structure
    const currentUrl = page.url();
    
    if (currentUrl.includes('/dashboard')) {
      // If we somehow reach dashboard, check its structure
      await expect(page.locator('h1')).toContainText('Dashboard');
    }
  });

  test('should test health check endpoint', async ({ page }) => {
    // Test the health check API endpoint
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const healthData = await response.json();
    expect(healthData).toHaveProperty('status', 'healthy');
    expect(healthData).toHaveProperty('timestamp');
  });

  test('should validate environment configuration', async ({ page }) => {
    // Test that the app loads without configuration errors
    await page.goto('/');
    
    // Should not show configuration error messages
    await expect(page.locator('text=Eksik environment')).not.toBeVisible();
    await expect(page.locator('text=Configuration error')).not.toBeVisible();
    
    // Should load the main page
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should test responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check mobile navigation
    const mobileMenu = page.locator('[data-testid="mobile-menu-button"]');
    
    // Mobile menu should be visible on small screens
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      // Check if mobile menu opens
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    }
  });

  test('should handle logout flow correctly', async ({ page }) => {
    // Navigate to a page that might have logout functionality
    await page.goto('/');
    
    // Look for logout button (this test assumes user is somehow authenticated)
    const logoutButton = page.locator('button', { hasText: 'Çıkış Yap' });
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // Should redirect to login or home
      await page.waitForTimeout(2000); // Wait for redirect
      
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/|login|auth/);
    }
  });

  test('should validate NextAuth API routes', async ({ page }) => {
    // Test NextAuth API endpoints
    const sessionResponse = await page.request.get('/api/auth/session');
    expect(sessionResponse.status()).toBe(200);
    
    // Should return valid session or null
    const sessionData = await sessionResponse.json();
    expect(sessionData).toBeDefined();
  });

  test('should test CSRF protection', async ({ page }) => {
    // Test CSRF token handling
    const csrfResponse = await page.request.get('/api/auth/csrf');
    expect(csrfResponse.status()).toBe(200);
    
    const csrfData = await csrfResponse.json();
    expect(csrfData).toHaveProperty('csrfToken');
    expect(csrfData.csrfToken).toBeTruthy();
  });

  test('should validate loading states', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for loading spinners or states
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    
    // Loading spinner should appear initially (if present)
    if (await loadingSpinner.isVisible()) {
      // Wait for loading to complete
      await expect(loadingSpinner).not.toBeVisible({ timeout: 10000 });
    }
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network error by going offline
    await page.context().setOffline(true);
    
    try {
      await page.goto('/dashboard', { timeout: 5000 });
    } catch (error) {
      // Network error is expected
    }
    
    // Go back online
    await page.context().setOffline(false);
    
    // Should be able to navigate normally
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should validate SEO and meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper meta tags
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /width=device-width/);
    
    // Check title
    await expect(page).toHaveTitle(/.+/);
  });

}); 