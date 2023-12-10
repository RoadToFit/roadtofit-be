import Joi from "joi";

const bearerToken = Joi.object().keys({
  headers: Joi.object().keys({
    authorization: Joi.string()
      .regex(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
      .required()
      .error(new Error('Invalid access token format')),
  }).unknown(),
}).unknown();

export {
  bearerToken,
}