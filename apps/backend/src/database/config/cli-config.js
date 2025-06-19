require('dotenv').config({ path: '../../../.env' });

module.exports = {
  development: {
    dialect: 'mysql',
    host: process.env.APP_DB_HOST || 'localhost',
    port: parseInt(process.env.APP_DB_PORT) || 3306,
    username: process.env.APP_DB_USER || 'app',
    password: process.env.APP_DB_PASS || 'app',
    database: process.env.APP_DB_NAME || 'app',
    migrationStorageTableName: 'sequelize_meta',
    define: {
      underscored: true,
      timestamps: true,
    },
  },
  production: {
    dialect: 'mysql',
    host: process.env.APP_DB_HOST,
    port: parseInt(process.env.APP_DB_PORT) || 3306,
    username: process.env.APP_DB_USER,
    password: process.env.APP_DB_PASS,
    database: process.env.APP_DB_NAME,
    migrationStorageTableName: 'sequelize_meta',
    define: {
      underscored: true,
      timestamps: true,
    },
  },
};
