/**
 * @openapi
 * components:
 *  schemas:
 *    HistoryEntity:
 *      type: object
 *      required:
 *        - historyId
 *        - userId
 *        - historyType
 *        - result
 *        - description
 *        - createdAt
 *        - updatedAt
 *      properties:
 *        historyId:
 *          type: number
 *        userId:
 *          type: number
 *        historyType:
 *          type: string
 *        result:
 *          type: string
 *        description:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export type HistoryEntity = {
  historyId: string;
  userId: number;
  historyType: number;
  result: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};