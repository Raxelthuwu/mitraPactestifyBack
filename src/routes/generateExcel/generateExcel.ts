import { Router } from 'express';
import { ReportsController } from '../../controllers/excelController/excelController.js';
import { authJWT } from '../../middleware/authJWT.js';

const exportsRouter = Router();
const reportsController = new ReportsController();

exportsRouter.get(
  '/export',
  authJWT,
  reportsController.exportReports.bind(reportsController)
);

export default exportsRouter;