import connection from '../db.js';

export async function getCategories(req, res) {
    const {order, desc, offset, limit} = req.query;

    try {
        if (order) {
            const categories = await connection.query(`
                SELECT * FROM categories 
                ORDER BY ${order} ${desc ? 'DESC' : ''}
            `);
            return res.send(categories.rows);
        }

        if (offset || limit) {
            const categories = await connection.query(`
                SELECT * FROM categories 
                ${offset ? `OFFSET ${offset}` : ''}
                ${limit ? `LIMIT ${limit}` : ''}
            `);
            return res.send(categories.rows);
        }

        const categories = await connection.query('SELECT * FROM categories');
        res.send(categories.rows);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function postCategories(req, res) {
    const {name} = req.body;
    if (name.length === 0) return res.sendStatus(400);
    
    try {
        const exist = await connection.query('SELECT * FROM categories WHERE name = $1', [name]);
        if (exist.rows.length > 0) return res.sendStatus(409);

        await connection.query('INSERT INTO categories (name) VALUES ($1)', [name]);
        res.sendStatus(201);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}