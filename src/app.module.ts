import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { CronService } from './cron.service';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TokenModule } from './token/token.module';
import { SendPdfModule } from './send-pdf/send-pdf.module';
import { DocumentsModule } from './documents/documents.module';

config();

const DB = process.env.DB;

@Module({
    imports: [
        HealthModule,
        LoggerModule,
        ScheduleModule.forRoot(),
        AuthModule,
        MongooseModule.forRoot(DB || ''),
        AuthModule,
        UsersModule,
        TokenModule,
        SendPdfModule,
        DocumentsModule,
    ],
    controllers: [AppController],
    providers: [AppService, CronService],
})
export class AppModule {}
