-- AlterTable
ALTER TABLE "Actor" ADD COLUMN     "createdById" INTEGER;

-- AlterTable
ALTER TABLE "Director" ADD COLUMN     "createdById" INTEGER;

-- AddForeignKey
ALTER TABLE "Director" ADD CONSTRAINT "Director_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
