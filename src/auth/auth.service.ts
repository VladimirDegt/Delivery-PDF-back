import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TokenService } from '../token/token.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { User } from '../users/user.schema';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

config();

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private tokenService: TokenService
    ) {}

    public async validateUser(userDto: LoginUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);

        if (user && passwordEquals) {
            return user;
        }
        throw new HttpException('Невірна пошта або пароль', HttpStatus.BAD_REQUEST);
    }

    private async generateToken(user: User) {
        const payload = { email: user.email };
        return {
            accessToken: this.jwtService.sign(
                { ...payload, key: JWT_ACCESS_TOKEN },
                { expiresIn: '365d' }
            ),
            refreshToken: this.jwtService.sign(
                { ...payload, key: JWT_REFRESH_TOKEN },
                { expiresIn: '365d' }
            ),
        };
    }
    async login(userDto: LoginUserDto) {
        const user = await this.validateUser(userDto);
        const tokens = await this.generateToken(user);
        const tokenId = await this.tokenService.saveTokens({ user, tokens });
        // @ts-expect-error check dto
        await this.userService.saveTokens({ user, tokenId });
        return {
            token: tokens.accessToken,
            userName: user.username,
        };
    }

    async register(userDto: CreateUserDto) {
        const user = await this.userService.createUser(userDto);
        const tokens = await this.generateToken(user);
        const tokenId = await this.tokenService.saveTokens({ user, tokens });
        // @ts-expect-error check dto
        await this.userService.saveTokens({ user, tokenId });
        return {
            token: tokens.accessToken,
            userName: user.username,
        };
    }
}
