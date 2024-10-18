import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';

import { AppModule } from './app.module';
import { logger, PinoLoggerService } from './logger/pino-logger.service';

config();

const PORT = process.env.PORT || 3000;
const FRONT_URL = process.env.FRONT_URL;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });
    app.useLogger(app.get(PinoLoggerService));

    // CORS
    app.enableCors({
        credentials: true,
        origin: [FRONT_URL || ''],
    });

    // Swagger
    const config = new DocumentBuilder()
        .setTitle('Backend SendMyPDF')
        .setDescription('API description')
        .setVersion('0.1')
        .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/api', app, document);

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.listen(PORT, () => logger.log(`Server started on port = ${PORT}`, 'Main.ts'));
}

bootstrap();
