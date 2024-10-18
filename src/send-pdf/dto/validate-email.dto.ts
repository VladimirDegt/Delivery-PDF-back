import { IsEmail } from 'class-validator';

class EmailValidationDTO {
    @IsEmail({}, { message: 'Невірний формат email' })
    email: string;

    constructor(email: string) {
        this.email = email;
    }
}

export default EmailValidationDTO;
