-- DropForeignKey
ALTER TABLE "UserActivityRecommendations" DROP CONSTRAINT "UserActivityRecommendations_activityId_fkey";

-- DropForeignKey
ALTER TABLE "UserFoodRecommendations" DROP CONSTRAINT "UserFoodRecommendations_foodId_fkey";

-- AddForeignKey
ALTER TABLE "UserFoodRecommendations" ADD CONSTRAINT "UserFoodRecommendations_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("foodId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityRecommendations" ADD CONSTRAINT "UserActivityRecommendations_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("activityId") ON DELETE CASCADE ON UPDATE CASCADE;
