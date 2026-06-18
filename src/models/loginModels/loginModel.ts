import { pool } from '../../config/database.js';

export class LoginModel {
  async findUserByCredentials(email: string, cc: bigint): Promise<boolean> {
    console.log('[LoginModel.findUserByCredentials] Input:', {
      email,
      cc: cc.toString(),
    });

    const result = await pool.query(
      `SELECT 1
       FROM testify.users
       WHERE email = $1 AND cc = $2 AND active = true`,
      [email, cc]
    );

    const exists = result.rowCount === 1;

    console.log('[LoginModel.findUserByCredentials] Rows found:', result.rowCount);
    console.log('[LoginModel.findUserByCredentials] Return:', exists);

    return exists;
  }

  async getUserPassword(email: string, cc: bigint): Promise<string | null> {
    console.log('[LoginModel.getUserPassword] Input:', {
      email,
      cc: cc.toString(),
    });

    const result = await pool.query<{ password: string }>(
      `SELECT password
       FROM testify.users
       WHERE email = $1 AND cc = $2 AND active = true`,
      [email, cc]
    );

    const password = result.rows[0]?.password ?? null;

    console.log('[LoginModel.getUserPassword] Rows found:', result.rowCount);
    console.log('[LoginModel.getUserPassword] Return:', password ? '[PASSWORD_FOUND]' : null);

    return password;
  }

  async getUserActive(email: string, cc: bigint): Promise<boolean | null> {
    console.log('[LoginModel.getUserActive] Input:', {
      email,
      cc: cc.toString(),
    });

    const result = await pool.query<{ active: boolean }>(
      `SELECT active
       FROM testify.users
       WHERE email = $1 AND cc = $2`,
      [email, cc]
    );

    const active = result.rows[0]?.active ?? null;

    console.log('[LoginModel.getUserActive] Rows found:', result.rowCount);
    console.log('[LoginModel.getUserActive] Return:', active);

    return active;
  }

  async setUserActive(email: string, cc: bigint): Promise<boolean> {
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