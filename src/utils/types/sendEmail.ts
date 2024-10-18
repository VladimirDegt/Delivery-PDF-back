export interface ISendEmail {
    file: Express.Multer.File;
    fileName: string;
    emailTo: string;
    emailFrom: string;
    password: string;
    user: string;
}
