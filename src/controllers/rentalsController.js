import connection from '../db.js';
import dayjs from 'dayjs';

export async function getRentals(req, res) {
    try {

        res.sendStatus(501);
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
        if (game.rows[0].stockTotal < rentals.rows.length) return res.sendStatus(400);
        
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