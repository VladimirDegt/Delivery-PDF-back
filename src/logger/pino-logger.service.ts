import { Injectable, LoggerService } from '@nestjs/common';
import pino from 'pino';

const pinoConfig = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
        },
    },
});

@Injectable()
export class PinoLoggerService implements LoggerService {
    private getMessage(message: string, context?: string) {
        return context ? `[${context}] ${message}` : message;
    }

    log(message: string, context?: string) {
        pinoConfig.info(this.getMessage(message, context));
    }

    error(message: string, context?: string, trace?: string) {
        pinoConfig.error(this.getMessage(message, context), trace);
    }

    warn(message: string, context?: string) {
        pinoConfig.warn(this.getMessage(message, context));
    }
}

export const logger = new PinoLoggerService();
