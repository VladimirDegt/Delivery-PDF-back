import { Module } from '@nestjs/common';
import { SendPdfController } from './send-pdf.controller';
import { SendPdfService } from './send-pdf.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Act, ActSchema } from './send-pdf.schema';
import { Token, TokenSchema } from '../token/token.schema';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../users/users.module';
import { User, UserSchema } from '../users/user.schema';

@Module({
    controllers: [SendPdfController],
    providers: [SendPdfService],
    imports: [
        TokenModule,
        UsersModule,
        MongooseModule.forFeature([
            { name: Act.name, schema: ActSchema },
            { name: Token.name, schema: TokenSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    exports: [SendPdfService],
})
export class SendPdfModule {}
