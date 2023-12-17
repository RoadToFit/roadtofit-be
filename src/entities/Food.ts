/**
 * @openapi
 * components:
 *  schemas:
 *    FoodEntity:
 *      type: object
 *      required:
 *        - foodId
 *        - name
 *        - calories
 *        - proteins
 *        - fat
 *        - carbohydrate
 *        - image
 *        - createdAt
 *        - updatedAt
 *      properties:
 *        foodId:
 *          type: string
 *        name:
 *          type: string
 *        calories:
 *          type: number
 *        proteins:
 *          type: number
 *        fat:
 *          type: number
 *        carbohydrate:
 *          type: number
 *        image:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export type FoodEntity = {
  foodId: string;
  name: string;
  calories: number;
  proteins: number;
  fat: number;
  carbohydrate: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};