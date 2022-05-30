import express from 'express';

import {getRentals, getMetrics, postRentals, postRentalsId, deleteRentals} from '../controllers/rentalsController.js';

const rentalsRouter = express.Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.get('/rentals/metrics', getMetrics);
rentalsRouter.post('/rentals', postRentals);
rentalsRouter.post('/rentals/:id/return', postRentalsId);
rentalsRouter.delete('/rentals/:id', deleteRentals);

export default rentalsRouter;