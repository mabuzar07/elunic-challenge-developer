import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserMessage } from '../../database/models/user-message.model';
import { databaseConfig } from '../../database/config/database.config';

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...databaseConfig[process.env.NODE_ENV || 'development'],
      models: [UserMessage],
    }),
    SequelizeModule.forFeature([UserMessage]),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
