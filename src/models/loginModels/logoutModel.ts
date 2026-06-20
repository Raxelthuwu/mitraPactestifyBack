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

//3
async isTokenRevoked(token: string): Promise<boolean> {
  console.log('[logouthModel.isTokenRevoked] Input:', {
    token: token ? '[PROVIDED]' : '[MISSING]',
  });

  const result = await pool.query(
    `SELECT 1
     FROM testify.revoked_tokens
     WHERE token = $1
       AND expires_at > now()`,
    [token]
  );

  const revoked = result.rowCount === 1;

  console.log('[logouthModel.isTokenRevoked] Rows found:', result.rowCount);
  console.log('[logouthModel.isTokenRevoked] Return:', revoked);

  return revoked;
}



  async saveActiveToken(id_user: number, token: string, expires_at: Date): Promise<boolean> {
    console.log('[logouthModel.saveActiveToken] Input:', { id_user, expires_at });
    const result = await pool.query(
      `INSERT INTO testify.active_tokens (id_user, token, expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (token) DO NOTHING`,
      [id_user, token, expires_at]
    );
    const success = result.rowCount === 1;
    console.log('[logouthModel.saveActiveToken] Rows affected:', result.rowCount);
    console.log('[logouthModel.saveActiveToken] Return:', success);
    return success;
  }

  async hasActiveToken(id_user: number): Promise<boolean> {
    console.log('[logouthModel.hasActiveToken] Input:', { id_user });
    const result = await pool.query(
      `SELECT 1
      FROM testify.active_tokens
      WHERE id_user = $1
        AND expires_at > now()`,
      [id_user]
    );
    const active = (result.rowCount ?? 0) > 0;
    console.log('[logouthModel.hasActiveToken] Rows found:', result.rowCount);
    console.log('[logouthModel.hasActiveToken] Return:', active);
    return active;
  }

  async deleteActiveToken(id_user: number): Promise<boolean> {
    console.log('[logouthModel.deleteActiveToken] Input:', { id_user });
    const result = await pool.query(
      `DELETE FROM testify.active_tokens WHERE id_user = $1`,
      [id_user]
    );
    const success = (result.rowCount ?? 0) > 0;
    console.log('[logouthModel.deleteActiveToken] Rows affected:', result.rowCount);
    console.log('[logouthModel.deleteActiveToken] Return:', success);
    return success;
  }





















}