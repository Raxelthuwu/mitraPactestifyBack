import { pool } from '../../config/database.js';


export class reportsModels{

async createReport(
  id_asignation: number,
  number_table: number,
  report: string,
  problem_grade: number,
  client_uuid: string,
  created_at: string
): Promise<boolean> {
  console.log('[createReport] Input:', {
    id_asignation,
    number_table,
    report,
    problem_grade,
    client_uuid,
    created_at,
  });

  const result = await pool.query(
    `INSERT INTO testify.reports (
       id_asignation,
       number_table,
       report,
       problem_grade,
       client_uuid,
       created_at
     )
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id_asignation, number_table, report, problem_grade, client_uuid, created_at]
  );

  const success = result.rowCount === 1;

  console.log('[createReport] Rows affected:', result.rowCount);
  console.log('[createReport] Return:', success);

  return success;
}

async getReportsByTableAndPlace(number_table: number, id_place: number): Promise<object[]> {
  console.log('[getReportsByTableAndPlace] Input:', {
    number_table,
    id_place,
  });

  const result = await pool.query(
    `SELECT 
       CONCAT('rep-', r.id_report) AS id,
       r.report AS text,
       CASE r.problem_grade
         WHEN 1 THEN 'bajo'
         WHEN 2 THEN 'medio'
         WHEN 3 THEN 'alto'
       END AS severity,
       u.name AS testigo,
       TO_CHAR(r.created_at, 'HH24:MI') AS hora
     FROM testify.reports r
     JOIN testify.asignations a ON r.id_asignation = a.id_asignation
     JOIN testify.vote_places vp ON a.id_place = vp.id_place
     JOIN testify.users u ON a.id_users = u.id_user
     WHERE r.number_table = $1
       AND vp.id_place = $2
     ORDER BY r.created_at DESC`,
    [number_table, id_place]
  );

  const reports = result.rows;

  console.log('[getReportsByTableAndPlace] Rows found:', result.rowCount);
  console.log('[getReportsByTableAndPlace] Return:', reports);

  return reports;
}



}