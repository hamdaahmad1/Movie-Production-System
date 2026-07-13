/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Actor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,releaseDate]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Actor_name_key" ON "Actor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_title_releaseDate_key" ON "Movie"("title", "releaseDate");
