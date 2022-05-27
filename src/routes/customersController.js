import express from 'express';

import {getCustomers, getCustomersId, postCustomers, putCustomers} from '../controllers/customersController.js';

const customersRouter = express.Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomersId);
customersRouter.post('/customers', postCustomers);
customersRouter.put('/customers', putCustomers);

export default customersRouter;