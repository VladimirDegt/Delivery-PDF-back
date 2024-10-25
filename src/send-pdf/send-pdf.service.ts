import { BadRequestException, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
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

        const writeFileAsync = promisify(fs.writeFile);
        const unlinkFileAsync = promisify(fs.unlink);

        try {
            const filePath = path.join(__dirname, 'files', decodedFileName);
            const dirPath = path.join(__dirname, 'files');
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            await writeFileAsync(filePath, file.buffer);
            const parseData = await pdfParse(filePath);
            const textPDF = parseData.text.trim();

            const regexEmail = /e-mail: ([^\s]+)/;
            const matchEmail = textPDF.match(regexEmail);

            await unlinkFileAsync(filePath);

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
