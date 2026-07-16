/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Actor` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Director` table. All the data in the column will be lost.
  - You are about to drop the column `posterUrl` on the `Movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Actor" DROP COLUMN "imageUrl",
ADD COLUMN     "imagePath" TEXT;

-- AlterTable
ALTER TABLE "Director" DROP COLUMN "imageUrl",
ADD COLUMN     "imagePath" TEXT;

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "posterUrl",
ADD COLUMN     "posterPath" TEXT;
