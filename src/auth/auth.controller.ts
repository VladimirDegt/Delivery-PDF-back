import { BadRequestException, Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogoutDto } from './dto/logout.dto';
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
    @Post('logout')
    async logout(@Body() body: LogoutDto, @Res() res: Response) {
        if (!body) {
            res.sendStatus(HttpStatus.NO_CONTENT);
            return;
        }
        try {
            const findToken = await this.tokenService.getByName(body.token);
            await this.tokenService.deleteToken(body.token);
            const user = await this.usersService.getUserByIdToken(findToken._id);
            await this.usersService.deleteToken(user._id);
            res.status(201).send({ token: '' });
        } catch (e) {
            throw new BadRequestException(e);
        }
    }
}
