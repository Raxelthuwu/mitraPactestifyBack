import { Router } from 'express';
import { ReportsController } from '../../controllers/reportsController/reportController.js';
import { authJWT } from '../../middleware/authJWT.js';
import { validateCreateReportSchema } from '../../middleware/middlewareReports/validateReportSchema.js';

const router = Router();
const reportsController = new ReportsController();

router.post('/testigo', authJWT, validateCreateReportSchema, (req, res) => reportsController.createReport(req as any, res));
router.get('/', authJWT, (req, res) => reportsController.getAllPlaces(req as any, res));
router.get('/report', authJWT, (req, res) => reportsController.getReportsByTable(req as any, res));

export default router;