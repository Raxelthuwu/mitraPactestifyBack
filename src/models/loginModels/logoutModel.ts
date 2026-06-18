import { pool } from '../../config/database.js';

export class logouthModel {
  async setUserActive(email: string, cc: bigint): Promise<boolean> {
    console.log('[logouthModel.setUserActive] Input:', { email, cc: cc.toString() });

    const result = await pool.query(
      `UPDATE testify.users
       SET active = true
       WHERE email = $1 AND cc = $2`,
      [email, cc]
    );

    const success = result.rowCount === 1;

    console.log('[logouthModel.setUserActive] Rows affected:', result.rowCount);
    console.log('[logouthModel.setUserActive] Return:', success);

    return success;
  }

  async setUserInactive(email: string, cc: bigint): Promise<boolean> {
    console.log('[logouthModel.setUserInactive] Input:', { email, cc: cc.toString() });

    const result = await pool.query(
      `UPDATE testify.users
       SET active = true
       WHERE email = $1 AND cc = $2`,
      [email, cc]
    );

    const success = result.rowCount === 1;

    console.log('[logouthModel.setUserInactive] Rows affected:', result.rowCount);
    console.log('[logouthModel.setUserInactive] Return:', success);

    return success;
  }
}