import type { Request, Response } from 'express';
import { ReportsService } from '../../services/generateExcel/generateExcel.js';

export class ReportsController {
  private reportsService = new ReportsService();

  constructor() {
    console.log('[ReportsController] Instance created');
  }

  async exportReports(req: Request, res: Response): Promise<void> {
    console.log('[ReportsController.exportReports] Query:', req.query);

    try {
      const puesto = String(req.query.puesto ?? req.query.Puesto ?? '');
      const mesa = Number(req.query.mesa ?? req.query.Mesa);

      if (!puesto || !mesa || Number.isNaN(mesa)) {
        console.error('[ReportsController.exportReports] Invalid query params:', {
          puesto,
          mesa,
        });

        res.status(400).json({
          status: 400,
          message: 'Invalid export parameters',
        });

        return;
      }

      const excelBuffer = await this.reportsService.exportReports(mesa, puesto);

      const safePuesto = puesto.trim().replace(/\s+/g, '-');
      const fileName = `reportesLugar-${safePuesto}-Mesa-${mesa}.xlsx`;

      console.log('[ReportsController.exportReports] File generated:', fileName);

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`
      );

      res.status(200).send(excelBuffer);
    } catch (error) {
      console.error('[ReportsController.exportReports] Error:', error);

      res.status(500).json({
        status: 500,
        message: 'Error exporting reports',
      });
    }
  }
}