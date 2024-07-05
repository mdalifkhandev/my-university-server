import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  BCRYPT_SALT_ROUND: process.env.BCRYPT,
  DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,
  NODE_NEW: process.env.NODE_NEW,
  JWT_SECRET_ACCESS_KE:process.env.JWT_SECRET_ACCESS_KE,
  JWT_SECRET_REFRESSRS_KE:process.env.JWT_SECRET_REFRESSRS_KE,
  JWT_SECRET_ACCESS_TIME:process.env.JWT_SECRET_ACCESS_TIME,
  JWT_SECRET_REFRESSRS_TIME:process.env.JWT_SECRET_REFRESSRS_TIME
};
