/*
  Warnings:

  - You are about to drop the column `release_year` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `awards` to the `Actor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `biography` to the `Actor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Actor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Actor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `biography` to the `Director` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Director` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `Director` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `posterUrl` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseDate` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Actor" ADD COLUMN     "awards" INTEGER NOT NULL,
ADD COLUMN     "biography" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Director" ADD COLUMN     "biography" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "nationality" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "release_year",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "posterUrl" TEXT NOT NULL,
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL;
