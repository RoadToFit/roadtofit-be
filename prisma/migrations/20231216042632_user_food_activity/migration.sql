/*
  Warnings:

  - You are about to drop the column `height` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `History` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "height",
DROP COLUMN "weight",
ADD COLUMN     "bmi" DOUBLE PRECISION,
ADD COLUMN     "bodyType" TEXT;

-- DropTable
DROP TABLE "History";

-- CreateTable
CREATE TABLE "Food" (
    "foodId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "proteins" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "carbohydrate" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("foodId")
);

-- CreateTable
CREATE TABLE "Activity" (
    "activityId" SERIAL NOT NULL,
    "activity" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "calPerHour" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("activityId")
);

-- CreateTable
CREATE TABLE "UserFoodRecommendations" (
    "userId" INTEGER NOT NULL,
    "foodId" INTEGER NOT NULL,

    CONSTRAINT "UserFoodRecommendations_pkey" PRIMARY KEY ("userId","foodId")
);

-- CreateTable
CREATE TABLE "UserActivityRecommendations" (
    "userId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,

    CONSTRAINT "UserActivityRecommendations_pkey" PRIMARY KEY ("userId","activityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Food_name_key" ON "Food"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_activity_key" ON "Activity"("activity");

-- AddForeignKey
ALTER TABLE "UserFoodRecommendations" ADD CONSTRAINT "UserFoodRecommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFoodRecommendations" ADD CONSTRAINT "UserFoodRecommendations_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("foodId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityRecommendations" ADD CONSTRAINT "UserActivityRecommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityRecommendations" ADD CONSTRAINT "UserActivityRecommendations_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("activityId") ON DELETE RESTRICT ON UPDATE CASCADE;
