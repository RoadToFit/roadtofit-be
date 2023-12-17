import Joi from "joi";

const bearerToken = Joi.object().keys({
  headers: Joi.object().keys({
    authorization: Joi.string()
      .regex(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
      .required()
      .error(new Error('Invalid access token format')),
  }).unknown(),
}).unknown();

const foodIdParam = Joi.object().keys({
  params: Joi.object().keys({
    foodId: Joi.string()
      .required()
      .error(new Error('Invalid foodId format')),
  }).unknown(),
}).unknown();

const activityIdParam = Joi.object().keys({
  params: Joi.object().keys({
    activityId: Joi.string()
      .required()
      .error(new Error('Invalid activityId format')),
  }).unknown(),
}).unknown();

export {
  bearerToken,
  foodIdParam,
  activityIdParam,
}