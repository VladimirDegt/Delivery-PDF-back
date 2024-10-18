import { BadRequestException, Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenService } from '../token/token.service';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Авторизація')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService,
        private readonly usersService: UsersService
    ) {}

    @ApiOperation({ summary: 'Реєстраія користувача' })
    @ApiResponse({
        status: 201,
        content: {
            'application/json': {
                example: {
                    token: '21321321321',
                },
            },
        },
    })
    @Post('register')
    async register(@Body() userDto: CreateUserDto) {
        return this.authService.register(userDto);
    }

    @ApiOperation({ summary: 'Логін користувача' })
    @ApiResponse({
        status: 201,
        content: {
            'application/json': {
                example: {
                    token: '21321321321',
                },
            },
        },
    })
    @Post('login')
    async login(@Body() userDto: LoginUserDto) {
        return this.authService.login(userDto);
    }

    @ApiOperation({ summary: 'Логаут користувача' })
    @ApiResponse({ status: 201 })
    @Get('logout')
    async logout(@Headers('authorization') authHeader: string) {
        const token = authHeader.split(' ')[1];
        try {
            const findToken = await this.tokenService.getByName(token);
            await this.tokenService.deleteToken(token);
            const user = await this.usersService.getUserByIdToken(findToken._id);
            await this.usersService.deleteToken(user._id);
            return { message: 'Logout success' };
        } catch (e) {
            throw new BadRequestException(e);
        }
    }
}
