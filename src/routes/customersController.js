import express from 'express';

import {getCustomers, postCustomers, putCustomers} from '../controllers/customersController.js';

const customersRouter = express.Router();

customersRouter.get('/customers', getCustomers);
customersRouter.post('/customers', postCustomers);
customersRouter.put('/customers', putCustomers);

export default customersRouter;