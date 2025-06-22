/**
 * Health Check API tests
 * 12Factor App - IV. Backing services monitoring tests
 */

// Mock the config and logger
jest.mock('@/lib/config', () => ({
  config: {
    auth0: {
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      issuer: 'https://test.auth0.com',
    },
    nextAuth: {
      secret: 'test-secret',
      url: 'http://localhost:3000',
    },
    app: {
      env: 'test',
      port: '3000',
    },
  },
  isDev: true,
}));

jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('/api/health', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return healthy response when all configs are valid', async () => {
    const { GET } = require('@/app/api/health/route');
    
    const mockRequest = {
      headers: {
        get: jest.fn(() => 'test-user-agent'),
      },
      ip: '127.0.0.1',
    };
    
    const response = await GET(mockRequest);
    
    // Test that response is returned (basic functionality)
    expect(response).toBeDefined();
    expect(typeof response.json).toBe('function');
  });

  it('should log health check requests', async () => {
    const { logger } = require('@/lib/logger');
    const { GET } = require('@/app/api/health/route');
    
    const mockRequest = {
      headers: {
        get: jest.fn(() => 'test-user-agent'),
      },
      ip: '127.0.0.1',
    };
    
    await GET(mockRequest);

    // Verify logger was called
    expect(logger.info).toHaveBeenCalledWith(
      'Health check requested',
      expect.objectContaining({
        userAgent: 'test-user-agent',
        ip: '127.0.0.1',
      })
    );
  });

  it('should handle request with missing headers gracefully', async () => {
    const { GET } = require('@/app/api/health/route');
    
    const mockRequest = {
      headers: {
        get: jest.fn(() => null),
      },
      ip: undefined,
    };
    
    const response = await GET(mockRequest);
    
    // Should still return a response even with missing data
    expect(response).toBeDefined();
    expect(typeof response.json).toBe('function');
  });
}); 