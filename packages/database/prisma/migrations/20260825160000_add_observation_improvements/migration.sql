-- AlterEnum: add observation update and delete audit actions
ALTER TYPE "AuditAction" ADD VALUE 'OBSERVATION_UPDATE';
ALTER TYPE "AuditAction" ADD VALUE 'OBSERVATION_DELETE';
