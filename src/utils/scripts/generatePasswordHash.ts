import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('[generatePasswordHash] Missing password');
  console.error('[generatePasswordHash] Usage: npx tsx src/utils/scripts/generatePasswordHash.ts "your-password"');
  process.exit(1);
}

const generatePasswordHash = async (): Promise<void> => {
  console.log('[generatePasswordHash] Input:', {
    password: '[PROVIDED]',
  });

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  console.log('[generatePasswordHash] Hash generated successfully');
  console.log(hash);
};

generatePasswordHash()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('[generatePasswordHash] Error:', error);
    process.exit(1);
  });