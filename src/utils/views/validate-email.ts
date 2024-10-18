import { IsEmail } from 'class-validator';

class EmailValidationDTO {
    @IsEmail({}, { message: 'Невірний формат email' })
    email: string;

    constructor(email: string) {
        this.email = email;
    }
}

export default EmailValidationDTO;

//How can I use it?
//const emailDto = new EmailValidationDTO('example@gmailcom')
//const errors = await validate(emailDto);
