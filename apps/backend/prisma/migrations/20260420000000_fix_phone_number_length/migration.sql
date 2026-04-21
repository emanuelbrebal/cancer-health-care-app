-- AlterTable: expand phone_number column from VARCHAR(14) to VARCHAR(20)
-- Reason: formatted mobile numbers (XX) XXXXX-XXXX are 15 chars, exceeding the old limit
ALTER TABLE "User" ALTER COLUMN "phone_number" TYPE VARCHAR(20);
