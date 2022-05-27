import connection from "../db.js";

export async function getCustomers(req, res) {
    try {
        const customers = await connection.query('SELECT * FROM customers');
        res.send(customers.rows);
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
    try {

        res.sendStatus(501);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}