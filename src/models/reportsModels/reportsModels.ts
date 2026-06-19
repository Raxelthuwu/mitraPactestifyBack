import { pool } from '../../config/database.js';


export class reportsModels{

  async createReport(
    id_asignation: number,
    number_table: number,
    report: string,
    problem_grade: number,
    client_uuid?: string
  ): Promise<boolean> {
    console.log('[createReport] Input:', {
      id_asignation,
      number_table,
      report,
      problem_grade,
      client_uuid,
    });

    const result = await pool.query(
      `INSERT INTO testify.reports (
        id_asignation,
        number_table,
        report,
        problem_grade,
        client_uuid
      )
      VALUES ($1, $2, $3, $4, $5)`,
      [id_asignation, number_table, report, problem_grade, client_uuid ?? null]
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

  async getAllPlaces(): Promise<object[]> {
    console.log('[reportsModels.getAllPlaces] Input: none');

    const result = await pool.query(
      `SELECT 
        name_place AS name,
        cuantity_tables AS tables
      FROM testify.vote_places
      ORDER BY zone, name_place`
    );

    console.log('[reportsModels.getAllPlaces] Rows found:', result.rowCount);
    console.log('[reportsModels.getAllPlaces] Return:', result.rows);
    return result.rows;
  }



async getPlaceIdByName(puesto: string): Promise<number | null> {
  console.log('[reportsModels.getPlaceIdByName] Input:', { puesto });

  const result = await pool.query<{ id_place: number }>(
    `SELECT id_place
     FROM testify.vote_places
     WHERE name_place = $1`,
    [puesto]
  );

  const id_place = result.rows[0]?.id_place ?? null;

  console.log('[reportsModels.getPlaceIdByName] Rows found:', result.rowCount);
  console.log('[reportsModels.getPlaceIdByName] Return:', id_place);

  return id_place;
}


}