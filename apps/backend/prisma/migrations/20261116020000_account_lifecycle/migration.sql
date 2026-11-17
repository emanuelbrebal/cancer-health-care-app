-- DropForeignKey
ALTER TABLE "DailyLog" DROP CONSTRAINT "DailyLog_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "suspendedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user_deletion_logs" DROP COLUMN "email",
DROP COLUMN "name";

-- AddForeignKey
ALTER TABLE "DailyLog" ADD CONSTRAINT "DailyLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

