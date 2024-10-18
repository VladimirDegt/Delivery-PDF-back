import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, NotContains } from 'class-validator';

export class LoginUserDto {
    @ApiProperty({
        example: 'example@gmail.com',
        description: 'Пошта користувача',
    })
    @IsString({ message: 'Дані повині бути строкою' })
    @Length(4, 50, { message: 'Не менше 4 та не більше 50 символів' })
    @IsEmail({}, { message: 'Некоректний email' })
    @IsNotEmpty({ message: 'Поле email відсутнє або пусте' })
    readonly email: string;

    @ApiProperty({ example: '12345', description: 'Пароль користувача' })
    @IsString({ message: 'Дані повинні бути строкою' })
    @Length(8, 50, { message: 'Не менше 8 та не більше 50 символів' })
    @IsNotEmpty({ message: 'Поле password відсутнє або пусте' })
    @NotContains(' ', { message: 'Пароль не повинен містити пробіли' })
    readonly password: string;
}
