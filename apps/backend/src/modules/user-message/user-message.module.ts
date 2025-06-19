import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserMessage } from '../../database/models/user-message.model';
import { UserMessageController } from './user-message.controller';
import { UserMessageService } from './user-message.service';
import { UserMessageRepository } from './user-message.repository';

@Module({
  imports: [SequelizeModule.forFeature([UserMessage])],
  controllers: [UserMessageController],
  providers: [UserMessageService, UserMessageRepository],
  exports: [UserMessageService],
})
export class UserMessageModule {}
