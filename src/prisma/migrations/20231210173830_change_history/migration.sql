/*
  Warnings:

  - You are about to drop the column `height` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `History` table. All the data in the column will be lost.
  - Added the required column `description` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `historyType` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `result` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HistoryType" AS ENUM ('BMI', 'BODYTYPE');

-- AlterTable
ALTER TABLE "History" DROP COLUMN "height",
DROP COLUMN "status",
DROP COLUMN "weight",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "historyType" "HistoryType" NOT NULL,
ADD COLUMN     "result" TEXT NOT NULL;
