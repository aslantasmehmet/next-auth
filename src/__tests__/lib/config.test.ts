/**
 * Config validation tests
 * 12Factor App - III. Config: Environment validation tests
 */

describe('Config Validation', () => {
  // Environment variables backup
  const originalEnv = process.env;
  const originalWindow = global.window;

  beforeEach(() => {
    // Reset modules to ensure fresh config loading
    jest.resetModules();
    // Clear the require cache
    delete require.cache[require.resolve('@/lib/config')];
    
    // Reset process.env
    process.env = { ...originalEnv };
    
    // Mock server-side environment
    delete (global as any).window;
  });

  afterAll(() => {
    process.env = originalEnv;
    global.window = originalWindow;
  });

  it('should load config successfully with all required env vars', () => {
    // Set all required environment variables
    Object.assign(process.env, {
      AUTH0_CLIENT_ID: 'test-client-id',
      AUTH0_CLIENT_SECRET: 'test-client-secret',
      AUTH0_ISSUER: 'https://test.auth0.com',
      NEXTAUTH_SECRET: 'test-secret-minimum-32-characters',
      NEXTAUTH_URL: 'http://localhost:3000',
      NODE_ENV: 'test',
    });

    const { config, isDev, isProd } = require('@/lib/config');

    expect(config.auth0.clientId).toBe('test-client-id');
    expect(config.auth0.clientSecret).toBe('test-client-secret');
    expect(config.auth0.issuer).toBe('https://test.auth0.com');
    expect(config.nextAuth.secret).toBe('test-secret-minimum-32-characters');
    expect(config.nextAuth.url).toBe('http://localhost:3000');
    expect(config.app.env).toBe('test');
    expect(isDev).toBe(false);
    expect(isProd).toBe(false);
  });

  it('should throw error when AUTH0_CLIENT_ID is missing', () => {
    // Set incomplete environment variables - missing AUTH0_CLIENT_ID
    Object.assign(process.env, {
      AUTH0_CLIENT_SECRET: 'test-secret',
      AUTH0_ISSUER: 'https://test.auth0.com',
      NEXTAUTH_SECRET: 'test-secret-minimum-32-characters',
      NEXTAUTH_URL: 'http://localhost:3000',
    });
    delete process.env.AUTH0_CLIENT_ID;

    expect(() => {
      require('@/lib/config');
    }).toThrow('Eksik environment değişkenleri: AUTH0_CLIENT_ID');
  });

  it('should throw error when multiple env vars are missing', () => {
    // Set incomplete environment variables - missing multiple
    Object.assign(process.env, {
      AUTH0_ISSUER: 'https://test.auth0.com',
      NEXTAUTH_SECRET: 'test-secret',
      NEXTAUTH_URL: 'http://localhost:3000',
    });
    delete process.env.AUTH0_CLIENT_ID;
    delete process.env.AUTH0_CLIENT_SECRET;

    expect(() => {
      require('@/lib/config');
    }).toThrow('Eksik environment değişkenleri: AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET');
  });

  it('should detect development environment correctly', () => {
    Object.assign(process.env, {
      AUTH0_CLIENT_ID: 'test-client-id',
      AUTH0_CLIENT_SECRET: 'test-client-secret',
      AUTH0_ISSUER: 'https://test.auth0.com',
      NEXTAUTH_SECRET: 'test-secret-minimum-32-characters',
      NEXTAUTH_URL: 'http://localhost:3000',
      NODE_ENV: 'development',
    });

    const { isDev, isProd } = require('@/lib/config');

    expect(isDev).toBe(true);
    expect(isProd).toBe(false);
  });

  it('should detect production environment correctly', () => {
    Object.assign(process.env, {
      AUTH0_CLIENT_ID: 'test-client-id',
      AUTH0_CLIENT_SECRET: 'test-client-secret',
      AUTH0_ISSUER: 'https://test.auth0.com',
      NEXTAUTH_SECRET: 'test-secret-minimum-32-characters',
      NEXTAUTH_URL: 'http://localhost:3000',
      NODE_ENV: 'production',
    });

    const { isDev, isProd } = require('@/lib/config');

    expect(isDev).toBe(false);
    expect(isProd).toBe(true);
  });
}); 