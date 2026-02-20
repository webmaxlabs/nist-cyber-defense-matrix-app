/**
 * Structured security event logging.
 * Outputs JSON to stdout for easy parsing by log aggregators.
 */

type SecurityEventType =
  | 'rate_limit_exceeded'
  | 'cors_violation'
  | 'invalid_redirect'
  | 'validation_failure'
  | 'auth_failure'

interface SecurityEvent {
  type: SecurityEventType
  message: string
  userId?: string
  ip?: string
  path?: string
  metadata?: Record<string, unknown>
}

export function logSecurityEvent(event: SecurityEvent): void {
  const entry = {
    level: 'warn',
    category: 'security',
    timestamp: new Date().toISOString(),
    ...event,
  }
  console.warn(JSON.stringify(entry))
}
