/*
  Warnings:

  - You are about to drop the column `assignmentFiles` on the `Topic` table. All the data in the column will be lost.
  - You are about to drop the column `resourceFiles` on the `Topic` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "assignmentFiles" TEXT[];

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "assignmentFiles",
DROP COLUMN "resourceFiles";
