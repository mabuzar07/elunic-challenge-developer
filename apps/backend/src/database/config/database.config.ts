import { Sequelize } from 'sequelize-typescript';
import { UserMessage } from '../models/user-message.model';

export const databaseConfig = {
  development: {
    dialect: 'mysql' as const,
    host: process.env.APP_DB_HOST || 'localhost',
    port: parseInt(process.env.APP_DB_PORT || '3306'),
    username: process.env.APP_DB_USER || 'app',
    password: process.env.APP_DB_PASS || 'app',
    database: process.env.APP_DB_NAME || 'app',
    logging: console.log,
    models: [UserMessage],
    autoLoadModels: true,
    synchronize: false, // Important: We use explicit migrations
  },
  production: {
    dialect: 'mysql' as const,
    host: process.env.APP_DB_HOST,
    port: parseInt(process.env.APP_DB_PORT || '3306'),
    username: process.env.APP_DB_USER,
    password: process.env.APP_DB_PASS,
    database: process.env.APP_DB_NAME,
    logging: false,
    models: [UserMessage],
    autoLoadModels: true,
    synchronize: false,
  },
};

export const sequelize = new Sequelize(
  databaseConfig[process.env.NODE_ENV || 'development']
);
