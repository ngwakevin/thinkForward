import { securityAuditRepository } from './db/security-audit-repository';
import { NextRequest } from 'next/server';

/**
 * Event types for security audit logging
 */
export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_COMPLETE = 'PASSWORD_RESET_COMPLETE',
  ACCOUNT_LOCKOUT = 'ACCOUNT_LOCKOUT',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  ACCESS_DENIED = 'ACCESS_DENIED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  ADMIN_ACTION = 'ADMIN_ACTION',
  API_ACCESS = 'API_ACCESS',
  DATA_ACCESS = 'DATA_ACCESS',
  CONFIGURATION_CHANGE = 'CONFIGURATION_CHANGE',
}

/**
 * Severity levels for security audit logging
 */
export enum SecurityEventSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

/**
 * Interface for security audit log entries
 */
interface SecurityAuditLogEntry {
  userId?: string;
  eventType: SecurityEventType;
  eventDetails: string;
  ipAddress?: string;
  userAgent?: string;
  severity: SecurityEventSeverity;
  metadata?: Record<string, any>;
}

/**
 * Extract request metadata from a Next.js request
 * @param req Next.js request object
 * @returns Object containing IP address and user agent
 */
export function getRequestMetadata(req: NextRequest): { ipAddress: string; userAgent: string } {
  // Get IP address from headers or connection
  const ipAddress = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') ||
                    'unknown';
  
  // Get user agent
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  return { ipAddress, userAgent };
}

/**
 * Log a security event to the audit trail
 */
export async function logSecurityEvent({
  userId,
  eventType,
  eventDetails,
  ipAddress,
  userAgent,
  severity = SecurityEventSeverity.INFO,
  metadata = {},
}: SecurityAuditLogEntry): Promise<void> {
  try {
    // Log to database using Cosmos DB repository
    try {
      await securityAuditRepository.create({
        id: crypto.randomUUID(),
        timestamp: new Date(),
        userId,
        eventType,
        eventDetails,
        ipAddress,
        userAgent,
        severity,
        metadata,
      });
    } catch (dbError) {
      // Fallback to console if DB operation fails
      console.error('Failed to write security log to database:', dbError);
    }
    
    // Always log to console as a backup
    console.log(`SECURITY_EVENT [${severity}] [${eventType}]: ${eventDetails}`, {
      userId,
      ipAddress,
      metadata,
    });
    
    // For critical events, could implement additional notification systems
    if (severity === SecurityEventSeverity.CRITICAL) {
      // Example: Send email, SMS, or trigger alerts
      try {
        await notifyCriticalSecurityEvent({
          eventType,
          eventDetails,
          userId,
          metadata,
        });
      } catch (notifyError) {
        console.error('Failed to send critical security notification:', notifyError);
      }
    }
  } catch (error) {
    console.error('Failed to log security event:', error);
    // Fallback logging to ensure events are captured
    console.log(`SECURITY_EVENT_FALLBACK [${severity}] [${eventType}]: ${eventDetails}`, {
      userId,
      ipAddress,
      metadata,
    });
  }
}

/**
 * Get request metadata for security logging
 */
export function getRequestMetadata(req: Request): {
  ipAddress: string;
  userAgent: string;
} {
  const ipAddress = 
    req.headers.get('x-forwarded-for') || 
    req.headers.get('x-real-ip') || 
    'unknown';
    
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  return {
    ipAddress: typeof ipAddress === 'string' ? ipAddress.split(',')[0].trim() : 'unknown',
    userAgent,
  };
}

/**
 * Notify security personnel of critical security events
 * Implement based on your notification requirements
 */
async function notifyCriticalSecurityEvent(eventData: any): Promise<void> {
  // Placeholder for implementing notification system
  // Could send emails, SMS, or integrate with security monitoring tools
  console.log('CRITICAL SECURITY EVENT NOTIFICATION:', eventData);
  
  // Example implementation would be added here based on notification requirements
}