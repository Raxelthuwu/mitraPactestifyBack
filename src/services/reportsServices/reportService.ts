import { reportsModels } from '../../models/reportsModels/reportsModels.js';
import { usersInformationModel } from '../../models/userModels/usersInformationModel.js';
import { randomUUID } from 'crypto';




interface RawReportData {
  Reporte: string;
  Mesa: number;
  Problem_Grade: number;
}

interface ParsedReportData {
  number_table: number;
  report: string;
  problem_grade: number;
  client_uuid: string;
}




export class ReportsService {
  private reportsModel = new reportsModels();
  private userModel = new usersInformationModel();
  
  constructor() {
    console.log('[ReportsService] Instance created');
  }


    private parseReportData(data: RawReportData): ParsedReportData {
    console.log('[ReportsService.parseReportData] Input:', data);

    const parsed: ParsedReportData = {
        number_table: data.Mesa,
        report: data.Reporte.trim(),
        problem_grade: data.Problem_Grade,
        client_uuid: randomUUID(),
    };

    console.log('[ReportsService.parseReportData] Return:', parsed);
    return parsed;
    }


    async createReport(id_user: number, data: RawReportData): Promise<{ status: number }> {
    console.log('[ReportsService.createReport] Input:', { id_user, ...data });

    try {
        const assignedPlace = await this.userModel.getAssignedPlaceByUserId(id_user) as { id_asignation: number } | null;

        if (!assignedPlace) {
        console.log('[ReportsService.createReport] No assignment found');
        return { status: 500 };
        }

        const parsed = this.parseReportData(data);

        const success = await this.reportsModel.createReport(
        assignedPlace.id_asignation,
        parsed.number_table,
        parsed.report,
        parsed.problem_grade,
        parsed.client_uuid
        );

        console.log('[ReportsService.createReport] Return:', { status: success ? 200 : 500 });
        return { status: success ? 200 : 500 };

    } catch (error) {
        console.error('[ReportsService.createReport] Error:', error);
        return { status: 500 };
    }

    }




    async getReportsByTable(number_table: number, id_place: number): Promise<{ status: number; reports: object[] }> {
    console.log('[ReportsService.getReportsByTable] Input:', { number_table, id_place });

    try {
        const reports = await this.reportsModel.getReportsByTableAndPlace(number_table, id_place);

        console.log('[ReportsService.getReportsByTable] Return:', { status: 200, reports });
        return { status: 200, reports };

    } catch (error) {
        console.error('[ReportsService.getReportsByTable] Error:', error);
        return { status: 500, reports: [] };
    }
    }


    async getAllPlaces(): Promise<{ status: number; places: object[] }> {
    console.log('[ReportsService.getAllPlaces] Input: none');

    try {
        const places = await this.reportsModel.getAllPlaces();

        console.log('[ReportsService.getAllPlaces] Return:', { status: 200, places });
        return { status: 200, places };

    } catch (error) {
        console.error('[ReportsService.getAllPlaces] Error:', error);
        return { status: 500, places: [] };
    }
    }






















}