import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../modules/database/database.module';
import { UserMessageModule } from '../modules/user-message/user-message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UserMessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
