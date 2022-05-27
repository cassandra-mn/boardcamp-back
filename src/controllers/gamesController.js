import connection from '../db.js';

export async function getGames(req, res) {

    res.sendStatus(200);
}

export async function postGames(req, res) {
    const {name, image, stockTotal, categoryId, pricePerDay} = req.body;

    if (name.length === 0) return res.sendStatus(400);
    if (stockTotal <= 0 || pricePerDay <= 0) return res.sendStatus(400);
    
    try {
        const category = await connection.query(`SELECT * FROM categories WHERE id = $1`, [categoryId]);
        if (category.rows.length === 0) return res.sendStatus(400);

        const exist = await connection.query(`SELECT * FROM games WHERE name = $1`, [name]);
        if (exist.rows.length > 0) return res.sendStatus(409);

        await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`, [name, image, stockTotal, categoryId, pricePerDay]);
        res.sendStatus(201);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}