import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class bodyInfoDto {
    @ApiProperty({
        example: 'Шановний клієнте!',
        description: 'Текст повідомлення',
    })
    @IsString({ message: 'textEmail must be a string' })
    @MaxLength(1000, { message: 'textEmail must be less than or equal to 1000 characters' })
    textEmail: string;

    @ApiProperty({
        example: 'example@example.com',
        description: 'На яку пошту відправлятимуся файли, незважаючи на вказану у документі',
    })
    @IsString({ message: 'emailTo must be a string' })
    emailTo: string;
}
