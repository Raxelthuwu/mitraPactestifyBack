export interface Report {
  id_report: number;
  id_asignation: number;
  number_table: number;
  report: string;
  problem_grade: 1 | 2 | 3;
  client_uuid: string | null;
  created_at: Date;
}