import connection from '../db.js';

import customerSchema from '../schemas/customerSchema.js';

export async function validateFormat(req, res, next) {
    const {error} = customerSchema.validate(req.body, {abortEarly: false});
    if (error) return res.status(400).send(error.details.map(detail => detail.message));
    
    const exist = await connection.query(`SELECT * FROM customers WHERE cpf = '${req.body.cpf}'`);
    if (exist.rows.length > 0) return res.sendStatus(409);
    
    next();
}