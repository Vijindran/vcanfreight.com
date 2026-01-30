import { NextResponse } from 'next/server';

/**
 * Structured error handler for API routes
 * Provides consistent error responses and logging
 */
export function handleApiError(
  error: unknown,
  context: string,
  statusCode: number = 500
) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error(`[ERROR] ${context}`, {
    message,
    stack,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json(
    {
      error: message,
      context: context,
      // In production, don't expose stack traces
      ...(process.env.NODE_ENV === 'development' && { stack }),
    },
    { status: statusCode }
  );
}

/**
 * Validates required environment variables
 * Throws error if any are missing
 */
export function requireEnv(...keys: string[]): Record<string, string> {
  const env: Record<string, string> = {};
  const missing: string[] = [];

  for (const key of keys) {
    const value = process.env[key];
    if (!value) {
      missing.push(key);
    } else {
      env[key] = value;
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  return env;
}

/**
 * Extract JWT token from Authorization header
 */
export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Generate consistent request logging
 */
export function logRequest(
  method: string,
  path: string,
  userId?: string,
  additional?: Record<string, any>
) {
  const timestamp = new Date().toISOString();
  console.log(`[${method}] ${path}`, {
    userId: userId || 'anonymous',
    timestamp,
    ...additional,
  });
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Minimum 8 characters
 */
export function isValidPassword(password: string): boolean {
  return (password?.length ?? 0) >= 8;
}

/**
 * Sanitize error message for client response
 * Removes sensitive information
 */
export function sanitizeErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  // Don't expose database errors, file paths, or internal details
  if (
    message.includes('database') ||
    message.includes('SQL') ||
    message.includes('ERR_') ||
    message.includes('/')
  ) {
    return 'An internal error occurred';
  }

  return message;
}

/**
 * Set secure response headers
 */
export function setSecureHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}
