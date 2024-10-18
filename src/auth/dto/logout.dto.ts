import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutDto {
    @ApiProperty({ example: '12345qwerty', description: 'Токен користувача' })
    @IsString({ message: 'Дані повинні бути строкою' })
    @IsNotEmpty({ message: 'Поле token відсутнє або пусте' })
    readonly token: string;
}
