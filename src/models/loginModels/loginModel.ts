import { pool } from '../../config/database.js';
import type { LoginUserData } from '../interfacesModels/Users_interface.js';


export class LoginModel {

  //1
  async findUserByCredentials(email: string, cc: bigint): Promise<LoginUserData | null> {
    console.log('[LoginModel.findUserByCredentials] Input:', {
      email,
      cc: cc.toString(),
    });

    const result = await pool.query<LoginUserData>(
      `SELECT 
        u.id_user,
        u.id_role,
        u.name,
        u.password,
        u.email,
        u.cc,
        u.active,
        r.type_rol
      FROM testify.users u
      JOIN testify.roles r ON u.id_role = r.id_role
      WHERE u.email = $1
        AND u.cc = $2
        AND u.active = true`,
      [email, cc]
    );

    const user = result.rows[0] ?? null;

    console.log('[LoginModel.findUserByCredentials] Rows found:', result.rowCount);
    console.log('[LoginModel.findUserByCredentials] Return:', user
      ? {
          ...user,
          password: '[PASSWORD_FOUND]',
          cc: user.cc.toString(),
        }
      : null
    );

    return user;
  }


  //2
  async setUserInactive(email: string, cc: bigint): Promise<boolean> {
    console.log('[LoginModel.setUserActive] Input:', {
      email,
      cc: cc.toString(),
    });

    const result = await pool.query(
      `UPDATE testify.users
       SET active = false
       WHERE email = $1 AND cc = $2`,
      [email, cc]
    );

    const success = result.rowCount === 1;

    console.log('[LoginModel.setUserActive] Rows affected:', result.rowCount);
    console.log('[LoginModel.setUserActive] Return:', success);

    return success;
  }
}