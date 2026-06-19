import { pool } from '../../config/database.js';

export class logouthModel {
  //1
  async setUserActive(id_user: number): Promise<boolean> {
    console.log('[logouthModel.setUserInactiveById] Input:', { id_user });

    const result = await pool.query(
      `UPDATE testify.users
      SET active = true
      WHERE id_user = $1`,
      [id_user]
    );

    const success = result.rowCount === 1;

    console.log('[logouthModel.setUserActiveById] Rows affected:', result.rowCount);
    console.log('[logouthModel.setUserActiveById] Return:', success);

    return success;
  }


  //2
  async revokeToken(token: string, expires_at: Date): Promise<boolean> {
  console.log('[logouthModel.revokeToken] Input:', {
    token: token ? '[PROVIDED]' : '[MISSING]',
    expires_at,
  });

  const result = await pool.query(
    `INSERT INTO testify.revoked_tokens (token, expires_at)
     VALUES ($1, $2)
     ON CONFLICT (token) DO NOTHING`,
    [token, expires_at]
  );

  const success = result.rowCount === 1;

  console.log('[logouthModel.revokeToken] Rows affected:', result.rowCount);
  console.log('[logouthModel.revokeToken] Return:', success);

  return success;
}







}