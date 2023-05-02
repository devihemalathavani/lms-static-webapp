/*
  Warnings:

  - You are about to drop the column `order` on the `Module` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "modulesOrder" INTEGER[];

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "order";
