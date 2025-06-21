// 12Factor App - IV. Backing services: Treat backing services as attached resources
import { NextRequest, NextResponse } from 'next/server';
import { config, isDev } from '@/lib/config';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Health check - 12Factor App monitoring
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.app.env,
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      checks: {
        auth0: checkAuth0Config(),
        nextauth: checkNextAuthConfig(),
        environment: checkEnvironment()
      }
    };

    // Log health check
    logger.info('Health check requested', {
      userAgent: request.headers.get('user-agent'),
      ip: request.ip || 'unknown'
    });

    return NextResponse.json(healthStatus);
  } catch (error) {
    logger.error('Health check failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { 
        status: 'unhealthy', 
        timestamp: new Date().toISOString(),
        error: isDev ? (error instanceof Error ? error.message : 'Unknown error') : 'Service unavailable'
      },
      { status: 503 }
    );
  }
}

function checkAuth0Config(): { status: string; message: string } {
  try {
    if (!config.auth0.clientId || !config.auth0.clientSecret || !config.auth0.issuer) {
      return { status: 'failed', message: 'Auth0 configuration eksik' };
    }
    return { status: 'ok', message: 'Auth0 configured' };
  } catch {
    return { status: 'failed', message: 'Auth0 config error' };
  }
}

function checkNextAuthConfig(): { status: string; message: string } {
  try {
    if (!config.nextAuth.secret || !config.nextAuth.url) {
      return { status: 'failed', message: 'NextAuth configuration eksik' };
    }
    return { status: 'ok', message: 'NextAuth configured' };
  } catch {
    return { status: 'failed', message: 'NextAuth config error' };
  }
}

function checkEnvironment(): { status: string; message: string } {
  return {
    status: 'ok',
    message: `Environment: ${config.app.env}`
  };
} 