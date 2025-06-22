/**
 * Logger service tests
 * 12Factor App - XI. Logs: Event streams testing
 */

// Console.log mock
const mockConsoleLog = jest.fn();
global.console = { ...console, log: mockConsoleLog };

describe('Logger Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should format logs correctly in development mode', () => {
    // Set development environment
    Object.assign(process.env, { NODE_ENV: 'development' });
    
    const { logger } = require('@/lib/logger');
    
    logger.info('Test message', { userId: '123' });
    
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('[INFO] Test message | {"userId":"123"}')
    );
  });

  it('should format logs as JSON in production mode', () => {
    // Set production environment
    Object.assign(process.env, { NODE_ENV: 'production' });
    
    const { logger } = require('@/lib/logger');
    
    logger.error('Error message', { error: 'test error' });
    
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('"level":"error"')
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('"message":"Error message"')
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('"service":"next-auth-app"')
    );
  });

  it('should log authentication success correctly', () => {
    Object.assign(process.env, { NODE_ENV: 'development' });
    
    const { logger } = require('@/lib/logger');
    
    logger.authSuccess('user123', 'auth0');
    
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('[INFO] Authentication successful')
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('"userId":"user123"')
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('"provider":"auth0"')
    );
  });

  it('should log authentication failure correctly', () => {
    Object.assign(process.env, { NODE_ENV: 'development' });
    
    const { logger } = require('@/lib/logger');
    
    logger.authFailed('Invalid credentials', 'auth0');
    
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('[WARN] Authentication failed')
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('"reason":"Invalid credentials"')
    );
  });

  it('should include timestamp in log entries', () => {
    Object.assign(process.env, { NODE_ENV: 'production' });
    
    const { logger } = require('@/lib/logger');
    
    logger.debug('Debug message');
    
    const logCall = mockConsoleLog.mock.calls[0][0];
    const logEntry = JSON.parse(logCall);
    
    expect(logEntry.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    expect(logEntry.service).toBe('next-auth-app');
  });
}); 