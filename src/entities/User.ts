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
 *        weight:
 *          type: number
 *          nullable: true
 *        height:
 *          type: number
 *          nullable: true
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
  weight: number | null;
  height: number | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};
