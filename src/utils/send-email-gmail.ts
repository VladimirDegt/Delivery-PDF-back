import * as process from 'process';
import { logger } from '../logger/pino-logger.service';
import { config } from 'dotenv';

config();

/* eslint-disable @typescript-eslint/no-require-imports */

const nodemailer = require('nodemailer');

export async function sendEmailGmail(
    file: Express.Multer.File,
    fileName: string,
    emailTo: string,
    textEmail: string
) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL,
            pass: process.env.PASSWORD_GMAIL,
        },
    });

    const mailOptions = {
        from: `${process.env.SENDER_NAME} <${process.env.GMAIL}>`,
        to: emailTo,
        subject: 'Документ',
        html: `<p>${textEmail}</p>`,
        attachments: [
            {
                filename: fileName,
                content: file.buffer, // Використання буфера для контенту файлу
                contentType: file.mimetype, // Встановлення коректного типу MIME
            },
        ],
        dsn: {
            id: 'delivery-status-notification',
            return: 'headers', // Або 'full', щоб отримати повний звіт
            notify: ['failure', 'delay', 'success'], // Отримувати звіти про всі події
            recipient: process.env.GMAIL, // Ваша email-адреса для отримання звітів
        },
        headers: {
            'Disposition-Notification-To': process.env.GMAIL, // Додати заголовок для повідомлення про прочитання
            'Return-Receipt-To': process.env.GMAIL, // Додати заголовок для отримання звіту про доставку
        },
    };

    transporter.verify(function (error: string, success: string) {
        if (error) logger.error(error, 'send-email-gmail.ts');
        else logger.log(`Server is ready to take our messages: ${success}`, 'send-email-gmail.ts');
    });

    try {
        return await transporter.sendMail(mailOptions);
    } catch (e) {
        console.log('sendEmail Error: ', e);
    }
}
