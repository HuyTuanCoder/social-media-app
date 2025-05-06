import { Router } from 'express';
import { generateReport } from '../controllers/report.controller';

const reportRoutes = Router();

reportRoutes.get('/:userId', generateReport); // Matches `/reports/:userId`

export default reportRoutes;