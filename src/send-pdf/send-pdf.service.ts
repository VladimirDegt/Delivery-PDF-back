import { BadRequestException, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { validateFile } from '../utils/validate-file';
import { logger } from '../logger/pino-logger.service';
import { sendEmailGmail } from '../utils/send-email-gmail';
import { Act, ActDocument } from './send-pdf.schema';
import { ISendEmail } from '../utils/types/sendEmail';
import { sendEmailKPMIC } from '../utils/send-email-kpmic';

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

        const writeFileAsync = promisify(fs.writeFile);

        try {
            const filePath = path.join('./src/public/files', decodedFileName);
            await writeFileAsync(filePath, file.buffer);
            const parseData = await pdfParse(filePath);
            const textPDF = parseData.text.trim();

            const regexEmail = /e-mail: ([^\s]+)/;
            const matchEmail = textPDF.match(regexEmail);

            return {
                result: matchEmail[1],
                fileName: decodedFileName,
                message: 'Email found',
            };
        } catch (_) {
            return {
                result: '',
                fileName: decodedFileName,
                message: `Error processing the file or the email value could not be found`,
            };
        }
    }

    async sendEmail({ file, fileName, emailTo, emailFrom, password, user }: ISendEmail) {
        if (emailFrom === process.env.GMAIL) {
            try {
                await sendEmailGmail(file, fileName, emailTo);
                const act = new this.actRepository({
                    emailTo,
                    emailFrom,
                    fileName,
                    result: 'Sending successful',
                    user,
                });
                return act.save();
            } catch (e) {
                logger.log(`sendEmail: ${e}`, 'function sendEmailGmail');
            }
        } else {
            try {
                await sendEmailKPMIC({ file, fileName, emailTo, emailFrom, password, user });
                const act = new this.actRepository({
                    emailTo,
                    emailFrom,
                    fileName,
                    result: 'Sending successful',
                    user,
                });
                return act.save();
            } catch (e) {
                logger.log(`sendEmail: ${e}`, 'function sendEmailKPMIC');
                throw new BadRequestException({ message: 'Invalid password kpmic' });
            }
        }
    }
}
