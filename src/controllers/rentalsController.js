import dayjs from 'dayjs';

import connection from '../db.js';

export async function getRentals(req, res) {
    const {customerId, gameId, status, startDate, order, desc, offset} = req.query;

    try {
        if (customerId) {
            const rentals = await connection.query(`
                SELECT rentals.*, customers.name as "customerName", 
                games.name as "gameName", categories.name as "categoryName"
                FROM rentals JOIN games ON rentals."gameId" = games.id
                JOIN customers ON rentals."customerId" = customers.id
                JOIN categories ON games."categoryId" = categories.id
                WHERE customers.id = ${customerId}
            `);
            return res.send(rentals.rows);
        }

        if (gameId) {
            const rentals = await connection.query(`
                SELECT rentals.*, customers.name as "customerName", 
                games.name as "gameName", categories.name as "categoryName"
                FROM rentals JOIN games ON rentals."gameId" = games.id
                JOIN customers ON rentals."customerId" = customers.id
                JOIN categories ON games."categoryId" = categories.id
                WHERE games.id = ${gameId}
            `);
            return res.send(rentals.rows);
        }

        if (status) {
            const rentals = await connection.query(`
                SELECT rentals.*, customers.name as "customerName", 
                games.name as "gameName", categories.name as "categoryName"
                FROM rentals JOIN games ON rentals."gameId" = games.id
                JOIN customers ON rentals."customerId" = customers.id
                JOIN categories ON games."categoryId" = categories.id   
                WHERE "returnDate" ${status === 'open' ? 'IS' : 'IS NOT'} null
            `);
            return res.send(rentals.rows);
        }

        if (startDate) {
            const rentals = await connection.query(`
                SELECT rentals.*, customers.name as "customerName", 
                games.name as "gameName", categories.name as "categoryName"
                FROM rentals JOIN games ON rentals."gameId" = games.id
                JOIN customers ON rentals."customerId" = customers.id
                JOIN categories ON games."categoryId" = categories.id   
                WHERE "rentDate" >= '${startDate}'
            `);
            return res.send(rentals.rows);
        }

        if (order) {
            const rentals = await connection.query(`
                SELECT rentals.*, customers.name as "customerName", 
                games.name as "gameName", categories.name as "categoryName"
                FROM rentals JOIN games ON rentals."gameId" = games.id
                JOIN customers ON rentals."customerId" = customers.id
                JOIN categories ON games."categoryId" = categories.id
                ORDER BY "${order}" ${desc ? 'DESC' : ''}
            `);
            return res.send(rentals.rows);
        }

        if (offset) {
            const rentals = await connection.query(`
                SELECT rentals.*, customers.name as "customerName", 
                games.name as "gameName", categories.name as "categoryName"
                FROM rentals JOIN games ON rentals."gameId" = games.id
                JOIN customers ON rentals."customerId" = customers.id
                JOIN categories ON games."categoryId" = categories.id
                OFFSET ${offset}
            `);
            return res.send(rentals.rows);
        }

        const rentals = await connection.query(`
            SELECT rentals.*, customers.name as "customerName", 
            games.name as "gameName", categories.name as "categoryName"
            FROM rentals JOIN games ON rentals."gameId" = games.id
            JOIN customers ON rentals."customerId" = customers.id
            JOIN categories ON games."categoryId" = categories.id
        `);
        res.send(rentals.rows);
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
    const {id} = req.params;

    try {
        const rental = await connection.query(`SELECT * FROM rentals WHERE id = ${id}`);
        if (rental.rows.length === 0) return res.sendStatus(404);

        const finished = await connection.query(`SELECT * FROM rentals WHERE id = ${id}`);
        if (finished.rows[0].returnDate) return res.sendStatus(400);

        const returnDate = dayjs(Date.now()).format('YYYY-MM-DD');
        await connection.query(`UPDATE rentals SET "returnDate" = $1 WHERE id = $2`, [returnDate, id]);
        
        const delay = await connection.query(`SELECT * FROM rentals WHERE id = ${id} AND "returnDate" - "rentDate" > "daysRented"`);
        if (delay.rows.length > 0) {
            const pricePerDay = delay.rows[0].originalPrice / delay.rows[0].daysRented;
            const delayDays = (delay.rows[0].returnDate - delay.rows[0].rentDate) / 86400000;
            const delayFee = pricePerDay * delayDays;
        
            await connection.query(`UPDATE rentals SET "delayFee" = $1 WHERE id = $2`, [delayFee, id]);
            return res.sendStatus(200);
        }
        
        await connection.query(`UPDATE rentals SET "delayFee" = 0 WHERE id = ${id}`);
        res.sendStatus(200);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function deleteRentals(req, res) {
    const {id} = req.params;

    try {
        const rental = await connection.query(`SELECT * FROM rentals WHERE id = ${id}`);
        if (rental.rows.length === 0) return res.sendStatus(404);

        const finished = await connection.query(`SELECT * FROM rentals WHERE id = ${id}`);
        if (finished.rows[0].returnDate) return res.sendStatus(400);

        await connection.query(`DELETE FROM rentals WHERE id = ${id}`);
        res.sendStatus(200);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}