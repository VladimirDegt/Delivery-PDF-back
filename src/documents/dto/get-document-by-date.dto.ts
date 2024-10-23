import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetDocumentByDateDto {
    @ApiProperty({
        example: '30-09-2024',
        description: 'Search start date',
        required: true,
    })
    @IsString({ message: 'Field must be a string' })
    @IsNotEmpty({ message: 'formatStartDate field is missing or empty' })
    formatStartDate: string;

    @ApiProperty({
        example: '30-09-2024',
        description: 'Search end date',
        required: true,
    })
    @IsString({ message: 'Field must be a string' })
    @IsNotEmpty({ message: 'formatStartDate field is missing or empty' })
    formatEndDate: string;
}
