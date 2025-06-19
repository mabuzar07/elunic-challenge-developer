import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';
import { sequelize } from './database.config';
import * as path from 'path';

export const migrator = new Umzug({
  migrations: {
    // Look for JS files since CLI uses JS
    glob: path.join(__dirname, '../migrations/*.js'),
    resolve: ({ name, path, context }) => {
      const migration = require(path);
      return {
        name,
        up: async () => migration.up(context, Sequelize),
        down: async () => migration.down(context, Sequelize),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;

export const runMigrations = async (): Promise<void> => {
  try {
    await migrator.up();
    console.log('All migrations executed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};
