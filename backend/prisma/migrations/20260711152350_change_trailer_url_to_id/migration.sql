/*
  Warnings:

  - You are about to drop the column `trailerUrl` on the `Director` table. All the data in the column will be lost.
  - Added the required column `trailerId` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Director" DROP COLUMN "trailerUrl";

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "trailerId" TEXT NOT NULL;
