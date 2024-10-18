import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as process from 'node:process';
import { logger } from './logger/pino-logger.service';

@Injectable()
export class CronService {
    @Cron('*/14 * * * *')
    async handleCron() {
        const response = await fetch(process.env.SERVER_URL + '/health');
        logger.log('Виконання розкладу крону', 'cron.service');
        logger.log(await response.json());
    }
}
