import Joi from "joi";

const create = Joi.object().keys({
  body: Joi.object().keys({
    userId: Joi.number()
      .required()
      .error(new Error('Invalid userId format')),
    historyType: Joi.string()
      .valid('BMI', 'BODYTYPE')
      .required()
      .error(new Error('Invalid historyType format')),
    result: Joi.string()
      .required()
      .error(new Error('Invalid result format')),
    description: Joi.string()
      .required()
      .error(new Error('Invalid description format')),
  })
}).unknown();

export {
  create,
}