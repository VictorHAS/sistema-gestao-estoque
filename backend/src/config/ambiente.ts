import dotenv from 'dotenv';

dotenv.config();

interface Config {
  porta: number;
  nodeEnv: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

export const config: Config = {
  porta: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'chave-secreta-padrao',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
};
