import { randomUUID } from 'crypto';
import ExcelJS from 'exceljs';
import { reportsModels } from '../../models/reportsModels/reportsModels.js';
import { usersInformationModel } from '../../models/userModels/usersInformationModel.js';

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
  hora: string;
}

export class ReportsService {
  private reportsModel = new reportsModels();
  private userModel = new usersInformationModel();

  constructor() {
    console.log('[ReportsService] Instance created');
  }


    private parseReportsForExcel(reports: object[]): object[] {
    console.log('[ReportsService.parseReportsForExcel] Input rows:', reports.length);

    const parsedReports = reports.map((report) => {
        const row = report as {
        id: string;
        text: string;
        severity: string | number;
        testigo: string;
        hora: string;
        };

        const severityValue = String(row.severity).toLowerCase();

        const severity =
        severityValue === '3' || severityValue === 'alto'
            ? 'Muy grave'
            : severityValue === '2' || severityValue === 'medio'
            ? 'Grave'
            : 'Media';

        const parsedReport = {
        ID: row.id,
        Hora: row.hora,
        Testigo: row.testigo,
        Gravedad: severity,
        Reporte: row.text,
        };

        console.log('[ReportsService.parseReportsForExcel] Parsed row:', parsedReport);

        return parsedReport;
    });

    console.log('[ReportsService.parseReportsForExcel] Return rows:', parsedReports.length);

    return parsedReports;
    }


    private async getPlaceIdByName(puesto: string): Promise<number | null> {
            console.log('[ReportsService.getPlaceIdByName] Input:', { puesto });

            const id_place = await this.reportsModel.getPlaceIdByName(puesto);

            console.log('[ReportsService.getPlaceIdByName] Return:', id_place);

            return id_place;
        }


    async exportReports(number_table: number, puesto: string): Promise<Buffer> {
        console.log('[ReportsService.exportReports] Input:', { number_table, puesto });

        const id_place = await this.getPlaceIdByName(puesto);

        if (!id_place) {
            console.error('[ReportsService.exportReports] Place not found:', { puesto });
            throw new Error('Place not found');
        }

        const reports = await this.reportsModel.getReportsByTableAndPlace(number_table, id_place);

        console.log('[ReportsService.exportReports] Reports found:', reports.length);

        const parsedReports = this.parseReportsForExcel(reports);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Reportes');

        workbook.creator = 'TestigosBack';
        workbook.created = new Date();

        this.addLogoToExcel(workbook, sheet);

        sheet.mergeCells('D5:F5');
        sheet.getCell('D5').value = `Reportes Lugar: ${puesto}`;
        sheet.getCell('D5').font = {
            bold: true,
            size: 16,
            color: { argb: 'FF243B86' },
        };

        sheet.mergeCells('D6:F6');
        sheet.getCell('D6').value = `Mesa: ${number_table}`;
        sheet.getCell('D6').font = {
            bold: true,
            size: 13,
            color: { argb: 'FF8E258D' },
        };

        const headerRow = sheet.getRow(8);
        headerRow.values = ['ID', 'Hora', 'Testigo', 'Gravedad', 'Reporte'];
        headerRow.commit();

        parsedReports.forEach((report) => {
            const r = report as { ID: string; Hora: string; Testigo: string; Gravedad: string; Reporte: string };
            const row = sheet.addRow([r.ID, r.Hora, r.Testigo, r.Gravedad, r.Reporte]);
            row.commit();
        });

        this.styleExcelSheet(sheet);

        const excelBuffer = await workbook.xlsx.writeBuffer();

        console.log('[ReportsService.exportReports] Excel generated successfully');
        console.log('[ReportsService.exportReports] Return:', '[EXCEL_BUFFER]');

        return Buffer.from(excelBuffer);
        }




    private addLogoToExcel(workbook: ExcelJS.Workbook, sheet: ExcelJS.Worksheet): void {
        console.log('[ReportsService.addLogoToExcel] Input:', {
            worksheetName: sheet.name,
        });

        const logoImage = workbook.addImage({
            filename: 'src/utils/media/pacto.png',
            extension: 'png',
        });

        sheet.addImage(logoImage, {
            tl: { col: 0, row: 0 },
            ext: { width: 260, height: 120 },
        });

        console.log('[ReportsService.addLogoToExcel] Return: void');
        }



    private styleExcelSheet(sheet: ExcelJS.Worksheet): void {
    console.log('[ReportsService.styleExcelSheet] Input:', {
        worksheetName: sheet.name,
    });

    const headerRowNumber = 8;

    const colors = {
        blue: 'FF243B86',
        gold: 'FFD08A00',
        red: 'FFC91826',
        green: 'FF008B4F',
        purple: 'FF8E258D',
        lightBlue: 'FFEAF0FF',
        lightGold: 'FFFFF7E6',
        border: 'FFD9E2F3',
        white: 'FFFFFFFF',
    };

    sheet.columns = [
        { key: 'ID', width: 14 },
        { key: 'Hora', width: 12 },
        { key: 'Testigo', width: 28 },
        { key: 'Gravedad', width: 18 },
        { key: 'Reporte', width: 70 },
    ];

    sheet.views = [{ state: 'frozen', ySplit: headerRowNumber }];

    const headerRow = sheet.getRow(headerRowNumber);

    headerRow.height = 32;
    headerRow.font = {
        bold: true,
        color: { argb: colors.white },
        size: 12,
    };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colors.blue },
    };
    headerRow.alignment = {
        vertical: 'middle',
        horizontal: 'center',
    };

    sheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
        cell.border = {
            top: { style: 'thin', color: { argb: colors.border } },
            left: { style: 'thin', color: { argb: colors.border } },
            bottom: { style: 'thin', color: { argb: colors.border } },
            right: { style: 'thin', color: { argb: colors.border } },
        };

        cell.alignment = {
            vertical: 'middle',
            horizontal: rowNumber === headerRowNumber ? 'center' : 'left',
            wrapText: true,
        };
        });

        if (rowNumber > headerRowNumber) {
        row.height = 36;

        row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
            argb: rowNumber % 2 === 0 ? colors.lightBlue : colors.lightGold,
            },
        };

        const severityCell = row.getCell('Gravedad');
        const severity = String(severityCell.value);

        severityCell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true,
        };

        severityCell.font = {
            bold: true,
            color: { argb: colors.white },
        };

        if (severity === 'Muy grave') {
            severityCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: colors.red },
            };
        }

        if (severity === 'Grave') {
            severityCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: colors.gold },
            };
        }

        if (severity === 'Media') {
            severityCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: colors.blue },
            };
        }
        }
    });

    console.log('[ReportsService.styleExcelSheet] Return: void');
    }















}