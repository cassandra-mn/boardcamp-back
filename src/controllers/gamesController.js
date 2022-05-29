import connection from '../db.js';

export async function getGames(req, res) {
    const {name, order, desc, offset, limit} = req.query;

    try {
        if (name) {
            const games = await connection.query(`
                SELECT games.*, categories.name as "categoryName" 
                FROM games JOIN categories ON games."categoryId" = categories.id 
                WHERE lower(games.name) LIKE lower('${name}%')
            `);
            return res.send(games.rows);
        } 

        if (order) {
            const games = await connection.query(`
                SELECT games.*, categories.name as "categoryName" 
                FROM games JOIN categories ON games."categoryId" = categories.id 
                ORDER BY "${order}" ${desc ? 'DESC' : ''}
            `);
            return res.send(games.rows);
        }

        if (offset || limit) {
            const games = await connection.query(`
                SELECT games.*, categories.name as "categoryName" 
                FROM games JOIN categories ON games."categoryId" = categories.id 
                ${offset ? `OFFSET ${offset}` : ''}
                ${limit ? `LIMIT ${limit}` : ''}
            `);
            return res.send(games.rows);
        }

        const games = await connection.query('SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id');
        res.send(games.rows);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function postGames(req, res) {
    const {name, image, stockTotal, categoryId, pricePerDay} = req.body;

    if (name.length === 0) return res.sendStatus(400);
    if (stockTotal <= 0 || pricePerDay <= 0) return res.sendStatus(400);
    
    try {
        const category = await connection.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
        if (category.rows.length === 0) return res.sendStatus(400);

        const exist = await connection.query('SELECT * FROM games WHERE name = $1', [name]);
        if (exist.rows.length > 0) return res.sendStatus(409);

        await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal, categoryId, pricePerDay]);
        res.sendStatus(201);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}