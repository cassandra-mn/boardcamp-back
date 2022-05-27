import customerSchema from '../schemas/customerSchema.js';

export function validateFormat(req, res, next) {
    const {error} = customerSchema.validate(req.body, {abortEarly: false});
    if (error) return res.status(400).send(error.details.map(detail => detail.message));
    next();
}