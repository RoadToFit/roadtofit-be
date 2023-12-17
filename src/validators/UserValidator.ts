import Joi from "joi";

const register = Joi.object().keys({
  body: Joi.object().keys({
    username: Joi.string()
      .required()
      .error(new Error('Invalid username format')),
    password: Joi.string()
      .required()
      .error(new Error('Invalid password format')),
    name: Joi.string()
      .required()
      .error(new Error('Invalid name format')),
    gender: Joi.string()
      .required()
      .valid('MALE', 'FEMALE')
      .error(new Error('Invalid gender format')),
  })
}).unknown();

const login = Joi.object().keys({
  body: Joi.object().keys({
    username: Joi.string()
      .required()
      .error(new Error('Invalid username format')),
    password: Joi.string()
      .required()
      .error(new Error('Invalid password format')),
  })
}).unknown();

const updateById = Joi.object().keys({
  body: Joi.object().keys({
    userId: Joi.number()
      .required()
      .error(new Error('Invalid userId format')),
    name: Joi.string()
      .optional()
      .error(new Error('Invalid name format')),
    age: Joi.number()
      .optional()
      .error(new Error('Invalid age format')),
    bodyType: Joi.string()
      .optional()
      .error(new Error('Invalid bodyType format')),
  })
}).unknown();

const updateImageById = Joi.object().keys({
  body: Joi.object().keys({
    userId: Joi.number()
      .required()
      .error(new Error('Invalid userId format')),
  }).unknown(),
}).unknown();

const updateRecommendationById = Joi.object().keys({
  body: Joi.object().keys({
    userId: Joi.number()
      .required()
      .error(new Error('Invalid userId format')),
  }).unknown(),
}).unknown();

const deleteById = Joi.object().keys({
  params: Joi.object().keys({
    userId: Joi.number()
      .required()
      .error(new Error('Invalid userId format')),
  }).unknown(),
}).unknown();

export {
  register,
  login,
  updateById,
  updateImageById,
  updateRecommendationById,
  deleteById,
}