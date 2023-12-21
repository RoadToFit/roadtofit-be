/*
  Warnings:

  - You are about to drop the column `carbohydrate` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `proteins` on the `Food` table. All the data in the column will be lost.
  - Added the required column `carbo` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menu` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protein` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Food_name_key";

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "carbohydrate",
DROP COLUMN "name",
DROP COLUMN "proteins",
ADD COLUMN     "carbo" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "menu" TEXT NOT NULL,
ADD COLUMN     "protein" DOUBLE PRECISION NOT NULL;
