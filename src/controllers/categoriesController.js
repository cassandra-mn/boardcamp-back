import connection from '../db.js';

export async function getCategories(req, res) {
    try {
        const categories = await connection.query('SELECT * FROM categories');
        res.send(categories.rows);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function postCategories(req, res) {

    res.send(200);
}