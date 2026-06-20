import type { Response } from 'express';
import { ReportsService } from '../../services/reportsServices/reportService.js';
import type { AuthRequest } from '../../middleware/authJWT.js';

export class ReportsController {
  private reportsService = new ReportsService();

  constructor() {
    console.log('[ReportsController] Instance created');
  }


  async createReport(req: AuthRequest, res: Response): Promise<void> {
    console.log('[ReportsController.createReport] Request received');

    const result = await this.reportsService.createReport(req.user!.id_user, req.body);

    res.status(result.status).json(result);
  }


  async getAllPlaces(req: AuthRequest, res: Response): Promise<void> {
    console.log('[ReportsController.getAllPlaces] Request received');

    const result = await this.reportsService.getAllPlaces();

    res.status(result.status).json(result);
  }

  
  async getReportsByTable(req: AuthRequest, res: Response): Promise<void> {
    console.log('[ReportsController.getReportsByTable] Request received');

    const puesto = String(req.query['puesto'] ?? req.query['Puesto'] ?? '');
    const number_table = Number(req.query['mesa'] ?? req.query['Mesa']);

    const result = await this.reportsService.getReportsByPuestoAndTable(puesto, number_table);

    res.status(result.status).json(result);
  }
}