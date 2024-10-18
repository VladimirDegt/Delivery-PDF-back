import { Module } from '@nestjs/common';
import { PinoLoggerService } from './pino-logger.service';

@Module({
    providers: [PinoLoggerService],
    exports: [PinoLoggerService],
})
export class LoggerModule {}
