import connection from '../db.js';
import dayjs from 'dayjs';

export async function getRentals(req, res) {
    const {customerId, gameId} = req.query;

    try {
        if (customerId) {
            const rental = await connection.query(`
                SELECT rentals.*, customers.name as "customerName", 
                games.name as "gameName", categories.name as "categoryName"
                FROM rentals JOIN games ON rentals."gameId" = games.id
                JOIN customers ON rentals."customerId" = customers.id
                JOIN categories ON games."categoryId" = categories.id
                WHERE customers.id = ${customerId}
            `);
            return res.send(rental.rows);
        }

        if (gameId) {
            const rental = await connection.query(`
                SELECT rentals.*, customers.name as "customerName", 
                games.name as "gameName", categories.name as "categoryName"
                FROM rentals JOIN games ON rentals."gameId" = games.id
                JOIN customers ON rentals."customerId" = customers.id
                JOIN categories ON games."categoryId" = categories.id
                WHERE games.id = ${gameId}
            `);
            return res.send(rental.rows);
        }

        const rental = await connection.query(`
            SELECT rentals.*, customers.name as "customerName", 
            games.name as "gameName", categories.name as "categoryName"
            FROM rentals JOIN games ON rentals."gameId" = games.id
            JOIN customers ON rentals."customerId" = customers.id
            JOIN categories ON games."categoryId" = categories.id;
        `);
        res.send(rental.rows);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function postRentals(req, res) {
    const {customerId, gameId, daysRented} = req.body;
    
    try {
        if (daysRented <= 0) return res.sendStatus(400);
        
        const customer = await connection.query(`SELECT * FROM customers WHERE id = ${customerId}`);
        if (!customer.rows[0]) return res.sendStatus(400);
        
        const game = await connection.query(`SELECT * FROM games WHERE id = ${gameId}`);
        if (!game.rows[0]) return res.sendStatus(400);
        
        const rentals = await connection.query('SELECT * FROM rentals');
        if (game.rows[0].stockTotal <= rentals.rows.length) return res.sendStatus(400);
        
        const originalPrice = daysRented * game.rows[0].pricePerDay;
        const rentDate = dayjs(Date.now()).format('YYYY-MM-DD');

        await connection.query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)', [customerId, gameId, rentDate, daysRented, null, originalPrice, null]);        

        res.sendStatus(201);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function postRentalsId(req, res) {
    try {
        
        res.sendStatus(501);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function deleteRentals(req, res) {
    try {
        
        res.sendStatus(501);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}