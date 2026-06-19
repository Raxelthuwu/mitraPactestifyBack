import { pool } from '../../config/database.js';


export class usersInformationModel{


async getAssignedPlaceByUserId(id_user: number): Promise<object | null> {
  console.log('[getAssignedPlaceByUserId] Input:', { id_user });

  const result = await pool.query(
    `SELECT 
       vp.name_place,
       vp.cuantity_tables
     FROM testify.asignations a
     JOIN testify.vote_places vp ON a.id_place = vp.id_place
     WHERE a.id_users = $1`,
    [id_user]
  );

  const assignedPlace = result.rows[0] ?? null;

  console.log('[getAssignedPlaceByUserId] Rows found:', result.rowCount);
  console.log('[getAssignedPlaceByUserId] Return:', assignedPlace);

  return assignedPlace;
}
    

}