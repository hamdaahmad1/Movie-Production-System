-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "createdById" INTEGER;

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
