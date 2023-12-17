import { ActivityEntity } from "./Activity";
import { FoodEntity } from "./Food";

/**
 * @openapi
 * components:
 *  schemas:
 *    UserEntity:
 *      type: object
 *      required:
 *        - userId
 *        - username
 *        - name
 *        - gender
 *        - foodRecommendations
 *        - activityRecommendations
 *        - createdAt
 *        - updatedAt
 *      properties:
 *        userId:
 *          type: number
 *        username:
 *          type: string
 *        name:
 *          type: string
 *        gender:
 *          type: string
 *        age:
 *          type: number
 *          nullable: true
 *        foodRecommendations:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/FoodEntity'
 *        activityRecommendations:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/ActivityEntity'
 *        imageUrl:
 *          type: string
 *          nullable: true
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export type UserEntity = {
  userId: string;
  username: string;
  name: string;
  gender: string;
  age: number | null;
  bodyType: string | null;
  bmi: number | null;
  imageUrl: string | null;
  foodRecommendations: FoodEntity[];
  activityRecommendations: ActivityEntity[];
  createdAt: Date;
  updatedAt: Date;
};
