import { BadRequestException, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { validateFile } from '../utils/validate-file';
import { logger } from '../logger/pino-logger.service';
import { Act, ActDocument } from './send-pdf.schema';
import { ISendEmail } from '../utils/types/sendEmail';
import { sendEmailGmail } from '../utils/send-email-gmail';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');

@Injectable()
export class SendPdfService {
    constructor(
        @InjectModel(Act.name)
        private actRepository: Model<ActDocument>
    ) {
        dotenv.config();
    }

    async getEmail(file: Express.Multer.File, decodedFileName: string) {
        const checkFile = validateFile(file);
        if (!checkFile) {
            throw new BadRequestException('Невірне розширення або розмір більше 5Mb');
        }

        const dirPath = path.join(__dirname, 'files');
        const filePath = path.join(dirPath, decodedFileName);

        try {
            try {
                await fs.mkdir(dirPath, { recursive: true });
                await fs.writeFile(filePath, file.buffer);
                logger.log(`file.buffer: ${file.buffer}`, 'function getEmail');
            } catch (e) {
                logger.log(`error writing file: ${e}`, 'function getEmail');
            }

            const parseData = await pdfParse(filePath);
            logger.log(`parseData: ${JSON.stringify(parseData)}`, 'function getEmail');
            const textPDF = parseData.text.trim();

            const regexEmail = /e-mail: ([^\s]+)/;
            const matchEmail = textPDF.match(regexEmail);

            await fs.unlink(filePath);

            return {
                result: matchEmail ? matchEmail[1] : '',
                fileName: decodedFileName,
                message: matchEmail ? 'Email found' : 'Email not found',
            };
        } catch (_) {
            return {
                result: '',
                fileName: decodedFileName,
                message: 'Error processing the file or the email value could not be found',
            };
        }
    }

    async sendEmail({ file, fileName, emailTo, textEmail, user }: ISendEmail) {
        try {
            await sendEmailGmail(file, fileName, emailTo, textEmail);
            const act = new this.actRepository({
                emailTo,
                textEmail,
                fileName,
                result: 'Sending successful',
                user,
            });
            return act.save();
        } catch (e) {
            logger.log(`sendEmail: ${e}`, 'function sendEmailGmail');
        }
    }
}
