/**
 * ThinkForward Security Configuration
 * Contains global security settings and constants
 */

export const securityConfig = {
  // Authentication
  auth: {
    // Session settings
    session: {
      maxAge: 60 * 60 * 24 * 7, // 1 week in seconds
      updateAge: 60 * 60 * 24, // 1 day in seconds
      secure: process.env.NODE_ENV === 'production',
    },
    // Password requirements
    password: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecialChar: true,
      maxHistoryCount: 5, // Number of previous passwords to check against
    },
    // Account lockout settings
    lockout: {
      maxFailedAttempts: 5,
      lockoutDurationMinutes: 15,
    },
    // Multi-factor authentication settings
    mfa: {
      enabled: process.env.MFA_ENABLED === 'true',
      requiredForAdmin: true,
      rememberDeviceDays: 30,
    }
  },
  
  // API Security
  api: {
    // Rate limiting
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequestsPerWindow: 100,
      // Specific endpoints may have custom limits
      endpoints: {
        '/api/auth': {
          windowMs: 60 * 1000, // 1 minute
          maxRequestsPerWindow: 5,
        }
      }
    },
    // API Key settings
    keys: {
      rotationDays: 90,
      maxActiveKeys: 2,
    }
  },
  
  // Content Security
  content: {
    // Allowed file uploads
    allowedUploads: {
      maxSizeMB: 5,
      allowedTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
    },
    // Sanitization settings
    sanitization: {
      allowedHtmlTags: [
        'p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
      ],
      allowedHtmlAttributes: {
        'a': ['href', 'title', 'target', 'rel'],
        'code': ['class'],
        'pre': ['class'],
      }
    }
  },
  
  // Audit and Monitoring
  audit: {
    enabled: true,
    logToDatabase: true,
    logToConsole: true,
    // Events that trigger critical notifications
    criticalEvents: [
      'ACCOUNT_LOCKOUT',
      'SUSPICIOUS_ACTIVITY',
      'ADMIN_ACTION',
      'MULTIPLE_AUTH_FAILURES'
    ],
  },
  
  // Encryption settings
  encryption: {
    algorithm: 'aes-256-gcm',
    keyRotationDays: 90,
  },
  
  // CORS settings
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ['https://thinkforward.domain.com'],
    allowCredentials: true,
    maxAge: 86400, // 1 day in seconds
  },
};

/**
 * Helper to determine if we're running in a production environment
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Helper to determine if we're running in a development environment
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Helper to get environment-specific security settings
 */
export function getSecuritySettingForEnv<T>(
  productionValue: T,
  developmentValue: T,
): T {
  return isProduction() ? productionValue : developmentValue;
}