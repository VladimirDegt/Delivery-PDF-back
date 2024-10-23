export interface ISendEmail {
    file: Express.Multer.File;
    fileName: string;
    emailTo: string;
    textEmail: string;
    user: string;
}
