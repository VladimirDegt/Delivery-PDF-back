import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class bodyInfoDto {
    @ApiProperty({
        example: 'example@example.com',
        description: 'З якої пошти відправлятимуся файли',
        required: true,
    })
    @IsEmail({}, { message: 'Некоректний email' })
    @IsNotEmpty({ message: 'Поле email відсутнє або пусте' })
    email: string;

    @ApiProperty({
        example: '9aa21f50-f96e-437c-8d2e-d7850061bd91',
        description: 'Пароль у випадку відправлення з пошти КП МІЦ',
        required: true,
    })
    @IsString({ message: 'password must be a string' })
    password: string;

    @ApiProperty({
        example: 'example@example.com',
        description: 'На яку пошту відправлятимуся файли, незважаючи на вказану у документі',
        required: true,
    })
    @IsString({ message: 'emailTo must be a string' })
    emailTo: string;
}
