/**
 * @openapi
 * components:
 *  schemas:
 *    ActivityEntity:
 *      type: object
 *      required:
 *        - activityId
 *        - activity
 *        - category
 *        - calPerHour
 *        - createdAt
 *        - updatedAt
 *      properties:
 *        activityId:
 *          type: string
 *        activity:
 *          type: string
 *        category:
 *          type: string
 *        calPerHour:
 *          type: number
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export type ActivityEntity = {
  activityId: string;
  activity: string;
  category: string;
  calPerHour: number;
  createdAt: Date;
  updatedAt: Date;
};