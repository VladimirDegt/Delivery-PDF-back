import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.schema';
import { Token, TokenSchema } from './token.schema';
import { TokenService } from './token.service';

@Module({
    providers: [TokenService],
    imports: [
        MongooseModule.forFeature([
            { name: Token.name, schema: TokenSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    exports: [TokenService],
})
export class TokenModule {}
