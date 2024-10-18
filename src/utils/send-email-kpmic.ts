import * as process from 'process';
import * as path from 'path';
import { logger } from '../logger/pino-logger.service';
import { config } from 'dotenv';
import { ISendEmail } from './types/sendEmail';
import { BadRequestException } from '@nestjs/common';

config();

/* eslint-disable @typescript-eslint/no-require-imports */

const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

export async function sendEmailKPMIC({ file, fileName, emailTo, emailFrom, password }: ISendEmail) {
    console.log('process.env.SENDER_NAME', process.env.SENDER_NAME);
    console.log('process.env.KPMIC', process.env.KPMIC);

    const transporter = nodemailer.createTransport({
        host: 'mail.khmr.gov.ua',
        port: 465,
        secure: true, // use TLS
        auth: {
            user: emailFrom,
            pass: password,
        },
    });

    const handlebarOptions = {
        viewEngine: {
            extName: '.html',
            partialsDir: path.resolve('src/utils/views'),
            defaultLayout: false,
        },
        viewPath: path.resolve('src/utils/views'),
        extName: '.handlebars',
    };

    transporter.use('compile', hbs(handlebarOptions));

    const additionalFilePath = path.resolve(
        'src/public/files/instruction/Інструкція підписання документа за допомогою Дії.docx'
    );

    const mailOptions = {
        from: emailFrom,
        to: emailTo,
        subject: `Лист від КП МІЦ`,
        template: 'email',
        attachments: [
            {
                filename: fileName,
                content: file.buffer, // Використання буфера для контенту файлу
                contentType: file.mimetype, // Встановлення коректного типу MIME
            },
            {
                filename: 'Інструкція підписання документа за допомогою Дії.docx', // Назва файлу, який буде прикріплений
                path: additionalFilePath, // Абсолютний шлях до файлу
                contentType:
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // MIME тип
            },
        ],
        dsn: {
            id: 'delivery-status-notification',
            return: 'headers', // Або 'full', щоб отримати повний звіт
            notify: ['failure', 'delay', 'success'], // Отримувати звіти про всі події
            recipient: process.env.KPMIC, // Ваша email-адреса для отримання звітів
        },
        headers: {
            'Disposition-Notification-To': process.env.KPMIC, // Додати заголовок для повідомлення про прочитання
            'Return-Receipt-To': process.env.KPMIC, // Додати заголовок для отримання звіту про доставку
        },
    };

    transporter.verify(function (error: string, success: string) {
        if (error) logger.error(error, 'send-email-gmail.ts');
        else logger.log(`Server is ready to take our messages: ${success}`, 'send-email-kpmic.ts');
    });

    try {
        return await transporter.sendMail(mailOptions);
    } catch (_) {
        throw new BadRequestException({ message: 'Invalid password kpmic' });
    }
}
