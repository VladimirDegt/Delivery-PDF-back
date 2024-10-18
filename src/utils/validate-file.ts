const maxSize = 5 * 1024 * 1024;
const extentionFile = 'pdf';
export function validateFile(file: Express.Multer.File): boolean {
    return file.mimetype === `application/${extentionFile}` && file.size <= maxSize;
}
