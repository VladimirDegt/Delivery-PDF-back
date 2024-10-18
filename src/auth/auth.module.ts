import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { tokenTimeConfig } from './config/token-timeConfig';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        TokenModule,
        UsersModule,
        forwardRef(() => UsersModule),
        JwtModule.register(tokenTimeConfig()),
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
