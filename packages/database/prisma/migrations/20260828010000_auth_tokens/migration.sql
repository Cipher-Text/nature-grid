-- Auth tokens: password reset and email verification flows.
-- Adds isEmailVerified to User, two token tables, and new AuditAction values.

-- Add email-verified flag to User (defaults to false for all existing rows).
ALTER TABLE "User" ADD COLUMN "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;

-- New AuditAction enum values.
ALTER TYPE "AuditAction" ADD VALUE 'PASSWORD_CHANGE';
ALTER TYPE "AuditAction" ADD VALUE 'PASSWORD_RESET_REQUEST';
ALTER TYPE "AuditAction" ADD VALUE 'PASSWORD_RESET';
ALTER TYPE "AuditAction" ADD VALUE 'EMAIL_VERIFICATION_SENT';
ALTER TYPE "AuditAction" ADD VALUE 'EMAIL_VERIFIED';

-- Password reset tokens (hashed, single-use, 1-hour TTL).
CREATE TABLE "PasswordResetToken" (
  "id"        TEXT      NOT NULL,
  "userId"    TEXT      NOT NULL,
  "tokenHash" TEXT      NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt"    TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
CREATE INDEX "PasswordResetToken_userId_idx"    ON "PasswordResetToken"("userId");
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");
ALTER TABLE "PasswordResetToken"
  ADD CONSTRAINT "PasswordResetToken_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Email verification tokens (hashed, single-use, 24-hour TTL).
CREATE TABLE "EmailVerificationToken" (
  "id"        TEXT      NOT NULL,
  "userId"    TEXT      NOT NULL,
  "tokenHash" TEXT      NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt"    TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");
CREATE INDEX "EmailVerificationToken_userId_idx" ON "EmailVerificationToken"("userId");
ALTER TABLE "EmailVerificationToken"
  ADD CONSTRAINT "EmailVerificationToken_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
