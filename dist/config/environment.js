import dotenv from 'dotenv';
dotenv.config();
export const environment = {
    port: Number(process.env.PORT || 3333),
    jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
    databaseUrl: process.env.DATABASE_URL || '',
    nodeEnv: process.env.NODE_ENV || 'development',
};
