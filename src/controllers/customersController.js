import connection from '../db.js';

export async function getCustomers(req, res) {
    const {cpf, order, desc, offset} = req.query;

    try {
        if (cpf) {
            const customers = await connection.query(`SELECT * FROM customers WHERE cpf LIKE '${cpf}%'`);
            return res.send(customers.rows);
        }

        if (order) {
            const customers = await connection.query(`SELECT * FROM customers ORDER BY ${order} ${desc ? 'DESC' : ''}`);
            return res.send(customers.rows);
        }

        if (offset) {
            const customers = await connection.query(`SELECT * FROM customers OFFSET ${offset}`);
            return res.send(customers.rows);
        }

        const customers = await connection.query('SELECT * FROM customers');
        res.send(customers.rows);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function getCustomersId(req, res) {
    const {id} = req.params;

    try {
        const user = await connection.query(`SELECT * FROM customers WHERE id = ${id}`);
        if (!user.rows[0]) return res.sendStatus(404);
        res.send(user.rows[0]);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function postCustomers(req, res) {
    const {name, phone, cpf, birthday} = req.body;

    try {
        await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)', [name, phone, cpf, birthday]);
        res.sendStatus(201);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function putCustomers(req, res) {
    const {id} = req.params;
    const {name, phone, cpf, birthday} = req.body;
    
    try {
        const noExist = await connection.query(`SELECT * FROM customers WHERE id = '${id}'`);
        if (noExist.rows.length === 0) return res.sendStatus(404);
    
        await connection.query('UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5', [name, phone, cpf, birthday, id]);
        res.sendStatus(200);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}