/**
 * @openapi
 * components:
 *  schemas:
 *    FoodEntity:
 *      type: object
 *      required:
 *        - foodId
 *        - menu
 *        - calories
 *        - protein
 *        - fat
 *        - carbo
 *        - image
 *        - category
 *        - createdAt
 *        - updatedAt
 *      properties:
 *        foodId:
 *          type: string
 *        menu:
 *          type: string
 *        calories:
 *          type: number
 *        protein:
 *          type: number
 *        fat:
 *          type: number
 *        carbo:
 *          type: number
 *        image:
 *          type: string
 *        category:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export type FoodEntity = {
  foodId: string;
  menu: string;
  calories: number;
  protein: number;
  fat: number;
  carbo: number;
  image?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
};