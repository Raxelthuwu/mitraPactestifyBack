import ExcelJS from 'exceljs';
import bcrypt from 'bcryptjs';
import { pool } from '../../config/database.js';

interface ExcelUserRow {
  name: string;
  email: string;
  cc: bigint;
  phone: bigint | null;
  password: string;
  id_role: number;
  id_place: number | null;
}

const getCellValue = (row: ExcelJS.Row, columnName: string): string => {
  const headers = row.worksheet.getRow(1);
  let columnIndex = 0;

  headers.eachCell((cell, index) => {
    const header = String(cell.value ?? '').trim().toLowerCase();

    if (header === columnName.toLowerCase()) {
      columnIndex = index;
    }
  });

  if (!columnIndex) {
    return '';
  }

  return String(row.getCell(columnIndex).value ?? '').trim();
};

const parseExcelRow = (row: ExcelJS.Row): ExcelUserRow => {
  const name = getCellValue(row, 'name') || getCellValue(row, 'nombre');
  const email = getCellValue(row, 'email') || getCellValue(row, 'correo');
  const ccValue = getCellValue(row, 'cc') || getCellValue(row, 'cedula');
  const phoneValue = getCellValue(row, 'phone') || getCellValue(row, 'telefono');
  const password = getCellValue(row, 'password') || getCellValue(row, 'contraseña');

  const roleValue =
    getCellValue(row, 'id_role') ||
    getCellValue(row, 'rol') ||
    getCellValue(row, 'role');

  const placeValue =
    getCellValue(row, 'id_place') ||
    getCellValue(row, 'puesto') ||
    getCellValue(row, 'codigo_puesto');

  if (!name || !email || !ccValue || !password || !roleValue) {
    throw new Error('Missing required user data');
  }

  return {
    name,
    email: email.toLowerCase(),
    cc: BigInt(ccValue),
    phone: phoneValue ? BigInt(phoneValue) : null,
    password,
    id_role: Number(roleValue),
    id_place: placeValue ? Number(placeValue) : null,
  };
};

const validateRoleId = async (id_role: number): Promise<void> => {
  console.log('[subirIn.validateRoleId] Input:', { id_role });

  const result = await pool.query<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT 1
       FROM testify.roles
       WHERE id_role = $1
     ) AS exists`,
    [id_role]
  );

  const exists = result.rows[0]?.exists ?? false;

  if (!exists) {
    throw new Error(`Role id does not exist: ${id_role}`);
  }

  console.log('[subirIn.validateRoleId] Role exists:', exists);
};

const upsertUser = async (user: ExcelUserRow): Promise<number> => {
  console.log('[subirIn.upsertUser] Input:', {
    name: user.name,
    email: user.email,
    cc: user.cc.toString(),
    phone: user.phone?.toString() ?? null,
    id_role: user.id_role,
    id_place: user.id_place,
    password: user.password ? '[PROVIDED]' : '[MISSING]',
  });

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const result = await pool.query<{ id_user: number }>(
    `INSERT INTO testify.users (id_role, name, password, email, cc, phone, active)
     VALUES ($1, $2, $3, $4, $5, $6, true)
     ON CONFLICT (email)
     DO UPDATE SET
       id_role = EXCLUDED.id_role,
       name = EXCLUDED.name,
       password = EXCLUDED.password,
       cc = EXCLUDED.cc,
       phone = EXCLUDED.phone
     RETURNING id_user`,
    [
      user.id_role,
      user.name,
      hashedPassword,
      user.email,
      user.cc,
      user.phone,
    ]
  );

  const id_user = result.rows[0]?.id_user;

  if (!id_user) {
    console.error('[subirIn.upsertUser] User could not be inserted or updated:', {
      email: user.email,
      cc: user.cc.toString(),
    });

    throw new Error('User could not be inserted or updated');
  }

  console.log('[subirIn.upsertUser] Return id_user:', id_user);

  return id_user;
};

const assignUserToPlace = async (id_user: number, id_place: number): Promise<void> => {
  console.log('[subirIn.assignUserToPlace] Input:', { id_user, id_place });

  await pool.query(
    `INSERT INTO testify.asignations (id_place, id_users)
     VALUES ($1, $2)
     ON CONFLICT (id_place, id_users)
     DO NOTHING`,
    [id_place, id_user]
  );

  console.log('[subirIn.assignUserToPlace] Assignment completed');
};

const uploadUsersFromExcel = async (filePath: string): Promise<void> => {
  console.log('[subirIn.uploadUsersFromExcel] Input:', { filePath });

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(1);

  if (!worksheet) {
    throw new Error('Excel file does not contain any worksheet');
  }

  let inserted = 0;
  let failed = 0;

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);

    try {
      const user = parseExcelRow(row);

      await validateRoleId(user.id_role);

      const id_user = await upsertUser(user);

      if (user.id_place) {
        await assignUserToPlace(id_user, user.id_place);
      }

      inserted += 1;

      console.log('[subirIn.uploadUsersFromExcel] Row processed:', {
        rowNumber,
        email: user.email,
        id_role: user.id_role,
        id_place: user.id_place,
      });
    } catch (error) {
      failed += 1;

      console.error('[subirIn.uploadUsersFromExcel] Row error:', {
        rowNumber,
        error,
      });
    }
  }

  console.log('[subirIn.uploadUsersFromExcel] Summary:', {
    inserted,
    failed,
  });
};

const filePath = process.argv[2];

if (!filePath) {
  console.error('[subirIn] Missing Excel file path');
  console.error('[subirIn] Usage: npx tsx src/utils/scripts/subirIn.ts "C:/ruta/archivo.xlsx"');
  process.exit(1);
}

uploadUsersFromExcel(filePath)
  .then(async () => {
    console.log('[subirIn] Import completed successfully');
    await pool.end();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('[subirIn] Import failed:', error);
    await pool.end();
    process.exit(1);
  });