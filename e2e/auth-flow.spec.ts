import { test, expect } from '@playwright/test';

/**
 * Authentication Flow E2E Tests
 * Login, logout ve middleware protection testing
 */

test.describe('Authentication Flow', () => {
  test('should display login page correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Login sayfası elementlerini kontrol et
    await expect(page.locator('h1')).toContainText('Giriş Yap');
    await expect(page.locator('text=Auth0 ile Giriş Yap')).toBeVisible();
    await expect(page.locator('text=Güvenli ve hızlı giriş')).toBeVisible();
  });

  test('should redirect to login when accessing protected route', async ({ page }) => {
    // Dashboard'a gitmeye çalış (protected route)
    await page.goto('/dashboard');
    
    // Login sayfasına yönlendirilmeli
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h1')).toContainText('Giriş Yap');
  });

  test('should redirect to login when accessing profile route', async ({ page }) => {
    // Profile'a gitmeye çalış (protected route)
    await page.goto('/profile');
    
    // Login sayfasına yönlendirilmeli
    await expect(page).toHaveURL(/.*login/);
  });

  test('should display home page correctly', async ({ page }) => {
    await page.goto('/');
    
    // Ana sayfa elementlerini kontrol et
    await expect(page.locator('h1')).toContainText('Next.js Auth0 Entegrasyonu');
    await expect(page.locator('text=Güvenli Kimlik Doğrulama')).toBeVisible();
    await expect(page.locator('text=Giriş Yap')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Navigation elementlerini kontrol et
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=Ana Sayfa')).toBeVisible();
    await expect(page.locator('text=Giriş Yap')).toBeVisible();
    
    // Login linkine tıkla
    await page.click('text=Giriş Yap');
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe('Health Check', () => {
  test('should return healthy status', async ({ request }) => {
    const response = await request.get('/api/health');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(data.environment).toBeDefined();
    expect(data.checks.auth0.status).toBe('ok');
    expect(data.checks.nextauth.status).toBe('ok');
  });
}); 