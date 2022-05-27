import connection from "../db.js";

export async function getCustomers(req, res) {
    const {cpf} = req.query;

    try {
        if (cpf) {
            const customers = await connection.query(`SELECT * FROM customers WHERE cpf LIKE '${cpf}%'`);
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
        const exist = await connection.query(`SELECT * FROM customers WHERE cpf = '${cpf}'`);
        if (exist.rows.length > 0) return res.sendStatus(409);

        await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)', [name, phone, cpf, birthday]);
        res.sendStatus(201);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function putCustomers(req, res) {
    try {

        res.sendStatus(501);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}