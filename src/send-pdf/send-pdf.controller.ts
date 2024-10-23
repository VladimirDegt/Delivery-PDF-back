import {
    BadRequestException,
    Body,
    Controller,
    Headers,
    Post,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { SendPdfService } from './send-pdf.service';
import { bodyInfoDto } from './dto/body-info.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Act, ActDocument } from './send-pdf.schema';
import { Model } from 'mongoose';
import { TokenService } from '../token/token.service';
import { UsersService } from '../users/users.service';
import { logger } from '../logger/pino-logger.service';
import EmailValidationDTO from './dto/validate-email.dto';
import { validate } from 'class-validator';

@ApiTags('Відправка файлів PDF на пошту')
@Controller('files')
export class SendPdfController {
    constructor(
        private readonly sendPdfService: SendPdfService,
        private readonly tokenService: TokenService,
        private readonly usersService: UsersService,
        @InjectModel(Act.name)
        private actRepository: Model<ActDocument>
    ) {}

    @ApiOperation({ summary: 'Отримання файлів' })
    @Post('acts')
    @UseInterceptors(AnyFilesInterceptor())
    async email(
        @Headers('authorization') authHeader: string,
        @Body() body: bodyInfoDto,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new BadRequestException('Authorization token is missing or invalid');
        }
        const token = authHeader.split(' ')[1];
        const findToken = await this.tokenService.getByName(token);
        const userId = await this.usersService.getUserByIdToken(findToken._id);
        if (!userId) throw new BadRequestException('Незареєстрований користувач');
        const user = await this.usersService.getUserByID(userId);

        try {
            for (const file of files) {
                const decodedFileName = Buffer.from(file.originalname, 'binary').toString('utf-8');
                if (body.emailTo) {
                    await this.sendPdfService.sendEmail({
                        file,
                        fileName: decodedFileName,
                        emailTo: body.emailTo,
                        textEmail: body.textEmail,
                        user: user.username,
                    });
                    continue;
                }

                const actEmail = await this.sendPdfService.getEmail(file, decodedFileName);

                if (!actEmail.result) {
                    logger.error('Email not found', 'send-pdf-controller');
                    const act = new this.actRepository({
                        emailTo: actEmail.result,
                        textEmail: body.textEmail,
                        fileName: actEmail.fileName,
                        result: 'Email not found',
                        user: user.username,
                    });
                    await act.save();
                    continue;
                }

                const emailDto = new EmailValidationDTO(actEmail.result);
                const errors = await validate(emailDto);
                if (errors.length > 0) {
                    logger.error('Format email is incorrect', 'send-pdf-controller');
                    const act = new this.actRepository({
                        emailTo: actEmail.result,
                        textEmail: body.textEmail,
                        fileName: actEmail.fileName,
                        result: 'Format email is incorrect',
                        user: user.username,
                    });
                    await act.save();
                    continue;
                }

                if (actEmail.result) {
                    await this.sendPdfService.sendEmail({
                        file,
                        fileName: actEmail.fileName,
                        emailTo: actEmail.result,
                        textEmail: body.textEmail,
                        user: user.username,
                    });
                }
            }
            return { message: 'Act sent successfully' };
        } catch (e) {
            return { error: e };
        }
    }
}
