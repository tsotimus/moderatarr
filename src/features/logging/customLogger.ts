/**
 * Custom logger for the Moderatarr application
 * Integrates with Hono's logger middleware and provides structured logging
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  requestId?: string;
}

class CustomLogger {
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private formatLogEntry(level: LogLevel, message: string, context?: Record<string, any>, requestId?: string): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      message,
      context,
      requestId,
    };
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, requestId?: string): void {
    const logEntry = this.formatLogEntry(level, message, context, requestId);
    
    // Format for console output
    const prefix = `[${logEntry.timestamp}] [${level.toUpperCase()}]`;
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    const requestIdStr = requestId ? ` [Request: ${requestId}]` : '';
    
    const fullMessage = `${prefix} ${message}${contextStr}${requestIdStr}`;
    
    switch (level) {
      case 'error':
        console.error(fullMessage);
        break;
      case 'warn':
        console.warn(fullMessage);
        break;
      case 'debug':
        console.debug(fullMessage);
        break;
      default:
        console.log(fullMessage);
    }
  }

  info(message: string, context?: Record<string, any>, requestId?: string): void {
    this.log('info', message, context, requestId);
  }

  warn(message: string, context?: Record<string, any>, requestId?: string): void {
    this.log('warn', message, context, requestId);
  }

  error(message: string, context?: Record<string, any>, requestId?: string): void {
    this.log('error', message, context, requestId);
  }

  debug(message: string, context?: Record<string, any>, requestId?: string): void {
    this.log('debug', message, context, requestId);
  }

  // Webhook-specific logging methods
  webhookReceived(notificationType: string, requestId?: string): void {
    this.info('Webhook received', { notificationType }, requestId);
  }

  webhookProcessed(notificationType: string, status: 'success' | 'error', requestId?: string, reason?: string): void {
    this.info('Webhook processed', { 
      notificationType, 
      status, 
      ...(reason && { reason }) 
    }, requestId);
  }

  mediaProcessing(mediaType: string, isAnime: boolean, tmdbId: number, requestId?: string): void {
    this.info('Processing media request', { 
      mediaType, 
      isAnime, 
      tmdbId 
    }, requestId);
  }

  requestStatusUpdate(requestId: string, oldStatus: string, newStatus: string): void {
    this.info('Request status updated', { 
      requestId, 
      oldStatus, 
      newStatus 
    });
  }

  emailSent(type: string, recipient: string, requestId?: string): void {
    this.info('Email sent', { 
      type, 
      recipient 
    }, requestId);
  }
}

// Create singleton instance
export const customLogger = new CustomLogger();

/**
 * PrintFunc for Hono's logger middleware
 * This function will be called by Hono's logger for HTTP request logging
 */
export const honoPrintFunc = (message: string, ...rest: string[]): void => {
  // Extract request info from Hono's message format
  // Hono typically logs in format: "<-- METHOD /path" and "--> METHOD /path status time"
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [HTTP]`;
  
  console.log(`${prefix} ${message}`, ...rest);
};

// Re-export the main logger instance as default
export default customLogger;