import supertest from 'supertest';
import connection from '../src/db.js';
import app from '../src/app.js';

beforeEach(async () => {
    await connection.query('TRUNCATE TABLE categories');
    await connection.query('TRUNCATE TABLE games');
    await connection.query('TRUNCATE TABLE customers');
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

describe('tests games route', () => {
    it('returns games', async() => {
        const result = await supertest(app).get('/games');
        expect(result).not.toBeNull();
    });

    it('returns 201 for valid parameters', async () => {
        await supertest(app).post('/categories').send({name: 'Teste'}); 
        const category = await supertest(app).get('/categories');
        const body = {
            name: 'teste', 
            image: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9jdXN8ZW58MHx8MHx8&w=1000&q=80', 
            stockTotal: 5, 
            categoryId: category.body[0].id, 
            pricePerDay: 50
        };
        const result = await supertest(app).post('/games').send(body); 
        expect(result.status).toEqual(201);
    });

    it('returns 409 for duplicate parameters', async () => {
        await supertest(app).post('/categories').send({name: 'Teste'}); 
        const category = await supertest(app).get('/categories');
        const body = {
            name: 'teste', 
            image: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9jdXN8ZW58MHx8MHx8&w=1000&q=80', 
            stockTotal: 5, 
            categoryId: category.body[0].id, 
            pricePerDay: 50
        };
        await supertest(app).post('/games').send(body); 
        const result = await supertest(app).post('/games').send(body); 
        expect(result.status).toEqual(409);
    });

    it('returns 422 for invalid parameters', async () => { 
        const body = {
            name: '', 
            image: '', 
            stockTotal: 0,
            categoryId: 0,
            pricePerDay: 0
        }
        const result = await supertest(app).post('/games').send(body); 
        expect(result.status).toEqual(400);
    });
});

describe('tests customers route', () => {
    it('returns customers', async() => {
        const result = await supertest(app).get('/customers');
        expect(result).not.toBeNull();
    });

    it('returns 201 for valid parameters', async () => { 
        const body = {
            name: 'teste', 
            phone: '78912345678', 
            cpf: '12345678912', 
            birthday: '2000-12-12'
        };
        const result = await supertest(app).post('/customers').send(body); 
        expect(result.status).toEqual(201);
    });

    it('returns 409 for duplicate parameters', async () => {
        const body = {
            name: 'teste', 
            phone: '78912345678', 
            cpf: '12345678912', 
            birthday: '2000-12-12'
        };
        await supertest(app).post('/customers').send(body); 
        const result = await supertest(app).post('/customers').send(body); 
        expect(result.status).toEqual(409);
    });

    it('returns 422 for invalid parameters', async () => { 
        const body = {name: '', phone: '', cpf: '', birthday: ''};
        const result = await supertest(app).post('/customers').send(body); 
        expect(result.status).toEqual(400);
    });
});

afterAll(async () => {
    await connection.end();
});