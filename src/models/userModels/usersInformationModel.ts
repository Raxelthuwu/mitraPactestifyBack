import { pool } from '../../config/database.js';


export class usersInformationModel{



async getActiveSessionTestifyUser(id_user: number): Promise<object | null> {
  console.log('[getActiveSessionTestifyUser] Input:', { id_user });

  const result = await pool.query(
    `SELECT u.name, r.type_rol, vp.name_place, vp.cuantity_tables
     FROM testify.users u
     JOIN testify.roles r ON u.id_role = r.id_role
     JOIN testify.asignations a ON u.id_user = a.id_users
     JOIN testify.vote_places vp ON a.id_place = vp.id_place
     WHERE u.id_user = $1`,
    [id_user]
  );

  const activeSessionUser = result.rows[0] ?? null;

  console.log('[getActiveSessionTestifyUser] Rows found:', result.rowCount);
  console.log('[getActiveSessionTestifyUser] Return:', activeSessionUser);

  return activeSessionUser;
}
    

async getUserIdByCredentials(email: string, cc: bigint): Promise<number | null> {
  console.log('[getUserIdByCredentials] Input:', {
    email,
    cc: cc.toString(),
  });

  const result = await pool.query<{ id_user: number }>(
    `SELECT id_user
     FROM testify.users
     WHERE email = $1
       AND cc = $2`,
    [email, cc]
  );

  const id_user = result.rows[0]?.id_user ?? null;

  console.log('[getUserIdByCredentials] Rows found:', result.rowCount);
  console.log('[getUserIdByCredentials] Return:', id_user);

  return id_user;
}



async getUserRoleById(id_user: number): Promise<string | null> {
  console.log('[getUserRoleById] Input:', { id_user });

  const result = await pool.query<{ type_rol: string }>(
    `SELECT r.type_rol
     FROM testify.users u
     JOIN testify.roles r ON u.id_role = r.id_role
     WHERE u.id_user = $1`,
    [id_user]
  );

  const role = result.rows[0]?.type_rol ?? null;

  console.log('[getUserRoleById] Rows found:', result.rowCount);
  console.log('[getUserRoleById] Return:', role);

  return role;
}


async getActiveSessionUser(id_user: number): Promise<object | null> {
  console.log('[getActiveSessionUser] Input:', { id_user });

  const result = await pool.query(
    `SELECT u.name, r.type_rol
     FROM testify.users u
     JOIN testify.roles r ON u.id_role = r.id_role
     WHERE u.id_user = $1`,
    [id_user]
  );

  const activeSessionUser = result.rows[0] ?? null;

  console.log('[getActiveSessionUser] Rows found:', result.rowCount);
  console.log('[getActiveSessionUser] Return:', activeSessionUser);

  return activeSessionUser;
}






    
}