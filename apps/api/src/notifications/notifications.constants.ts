import type { AlertSeverity } from '@prisma/client';

export const EMAIL_QUEUE = 'email';

/** Job sent when a user requests a password reset. */
export interface PasswordResetJobData {
  to: string;
  displayName: string;
  resetUrl: string;
}

/** Job sent when a new user registration needs email verification. */
export interface EmailVerificationJobData {
  to: string;
  displayName: string;
  verificationUrl: string;
}

/**
 * Job sent once per subscriber when an alert is dispatched.
 */
export interface AlertNotificationJobData {
  deliveryId: string;
  to: string;
  displayName: string;
  alert: {
    id: string;
    title: string;
    severity: AlertSeverity;
    description: string;
    instructions: string | null;
    issuedAt: string;
    district: { name: string } | null;
  };
}
