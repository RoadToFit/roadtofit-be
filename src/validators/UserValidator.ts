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
})

const login = Joi.object().keys({
  body: Joi.object().keys({
    username: Joi.string()
      .required()
      .error(new Error('Invalid username format')),
    password: Joi.string()
      .required()
      .error(new Error('Invalid password format')),
  })
})

const updateById = Joi.object().keys({
  body: Joi.object().keys({
    userId: Joi.string()
      .required()
      .error(new Error('Invalid userId format')),
    age: Joi.number()
      .required()
      .error(new Error('Invalid age format')),
    weight: Joi.number()
      .required()
      .error(new Error('Invalid weight format')),
    height: Joi.number()
      .required()
      .error(new Error('Invalid height format')),
  })
})

const updateImageById = Joi.object().keys({
  body: Joi.object().keys({
    userId: Joi.string()
      .required()
      .error(new Error('Invalid userId format')),
  })
})

export {
  register,
  login,
  updateById,
  updateImageById,
}