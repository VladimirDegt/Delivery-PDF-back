import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Act, ActSchema } from '../send-pdf/send-pdf.schema';

@Module({
    controllers: [DocumentsController],
    providers: [DocumentsService],
    imports: [
        TokenModule,
        UsersModule,
        MongooseModule.forFeature([{ name: Act.name, schema: ActSchema }]),
    ],
})
export class DocumentsModule {}
