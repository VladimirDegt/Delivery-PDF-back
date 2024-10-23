import { BadRequestException, Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { TokenService } from '../token/token.service';
import { UsersService } from '../users/users.service';
import { DocumentsService } from './documents.service';
import { GetDocumentByDateDto } from './dto/get-document-by-date.dto';

@ApiTags('Робота з документами')
@Controller('document')
export class DocumentsController {
    constructor(
        private readonly documentsService: DocumentsService,
        private readonly tokenService: TokenService,
        private readonly usersService: UsersService
    ) {}

    @ApiOperation({ summary: 'Документи відправлені на пошту сьогодні' })
    @ApiResponse({
        status: 200,
    })
    @Get('last')
    async getLastDocuments(@Headers('authorization') authHeader: string) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new BadRequestException('Authorization token is missing or invalid');
        }
        const token = authHeader.split(' ')[1];
        const findToken = await this.tokenService.getByName(token);
        const userId = await this.usersService.getUserByIdToken(findToken._id);
        if (!userId) throw new BadRequestException('Незареєстрований користувач');

        return await this.documentsService.getTodayDocuments(userId);
    }

    @ApiOperation({ summary: 'Отримання документів за вказану дату' })
    @ApiResponse({
        status: 201,
    })
    @Post('date')
    async getDocumentByDate(
        @Headers('authorization') authHeader: string,
        @Body() body: { dates: GetDocumentByDateDto }
    ) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new BadRequestException('Authorization token is missing or invalid');
        }
        const token = authHeader.split(' ')[1];
        const findToken = await this.tokenService.getByName(token);
        const userId = await this.usersService.getUserByIdToken(findToken._id);
        if (!userId) throw new BadRequestException('Незареєстрований користувач');
        try {
            return await this.documentsService.getDocuments(body.dates, userId);
        } catch (_) {
            throw new BadRequestException({ error: 'Format date is wrong' });
        }
    }
}
