-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE');

-- AlterTable: make passwordHash nullable, add googleId and authProvider
ALTER TABLE "User"
  ALTER COLUMN "passwordHash" DROP NOT NULL,
  ADD COLUMN "googleId"     TEXT,
  ADD COLUMN "authProvider" "AuthProvider" NOT NULL DEFAULT 'EMAIL';

-- CreateIndex: partial unique index on googleId (NULLs are not unique in Postgres)
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId") WHERE "googleId" IS NOT NULL;

-- CreateTable: short-lived one-time exchange codes issued after Google OAuth succeeds
CREATE TABLE "OAuthExchangeCode" (
    "id"        TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "code"      TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt"    TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OAuthExchangeCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OAuthExchangeCode_code_key" ON "OAuthExchangeCode"("code");
CREATE INDEX "OAuthExchangeCode_userId_idx" ON "OAuthExchangeCode"("userId");
CREATE INDEX "OAuthExchangeCode_expiresAt_idx" ON "OAuthExchangeCode"("expiresAt");

-- AddForeignKey
ALTER TABLE "OAuthExchangeCode" ADD CONSTRAINT "OAuthExchangeCode_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
