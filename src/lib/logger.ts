// 12Factor App - XI. Logs: Treat logs as event streams
import { isDev } from './config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: Record<string, any>;
  service: string;
}

class Logger {
  private serviceName: string;

  constructor(serviceName: string = 'next-auth-app') {
    this.serviceName = serviceName;
  }

  private formatLog(level: LogLevel, message: string, meta?: Record<string, any>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      service: this.serviceName
    };
  }

  private output(logEntry: LogEntry) {
    if (isDev) {
      // Development: readable console output
      const metaStr = logEntry.meta ? ` | ${JSON.stringify(logEntry.meta)}` : '';
      console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.message}${metaStr}`);
    } else {
      // Production: structured JSON output for log aggregation
      console.log(JSON.stringify(logEntry));
    }
  }

  debug(message: string, meta?: Record<string, any>) {
    this.output(this.formatLog('debug', message, meta));
  }

  info(message: string, meta?: Record<string, any>) {
    this.output(this.formatLog('info', message, meta));
  }

  warn(message: string, meta?: Record<string, any>) {
    this.output(this.formatLog('warn', message, meta));
  }

  error(message: string, meta?: Record<string, any>) {
    this.output(this.formatLog('error', message, meta));
  }

  // Authentication specific logging methods
  authSuccess(userId: string, provider: string) {
    this.info('Authentication successful', {
      userId,
      provider,
      event: 'auth_success'
    });
  }

  authFailed(reason: string, provider: string) {
    this.warn('Authentication failed', {
      reason,
      provider,
      event: 'auth_failed'
    });
  }
}

// Singleton instance for consistent logging
export const logger = new Logger('next-auth-app'); 