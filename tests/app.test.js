import supertest from 'supertest';
import connection from '../src/db.js';
import app from '../src/app.js';

beforeEach(async () => {
    await connection.query('TRUNCATE TABLE categories');
});

describe('tests categories route', () => {
    it('returns categories', async() => {
        const result = await supertest(app).get('/categories');
        expect(result).not.toBeNull();
    });

    it('returns 201 for valid parameters', async () => { 
        const result = await supertest(app).post('/categories').send({name: 'Teste'}); 
        expect(result.status).toEqual(201);
    });

    it('returns 409 for duplicate parameters', async () => {
        await supertest(app).post('/categories').send({name: 'Teste'}); 
        const result = await supertest(app).post('/categories').send({name: 'Teste'}); 
        expect(result.status).toEqual(409);
    });

    it('returns 422 for invalid parameters', async () => { 
        const result = await supertest(app).post('/categories').send({name: ''}); 
        expect(result.status).toEqual(400);
    });
});

afterAll(async () => {
    await connection.end();
});