import joi from 'joi';
import JoiDate from '@joi/date';

const Joi = joi.extend(JoiDate);

const customerSchema = joi.object({
    name: joi.string().min(3).required(),
    phone: joi.string().pattern(/^[0-9]{10,11}$/).required(),
    cpf: joi.string().pattern(/^[0-9]{11}$/).required(),
    birthday: Joi.date().format('YYYY-MM-DD').required()
});

export default customerSchema;