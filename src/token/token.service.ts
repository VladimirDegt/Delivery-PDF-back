import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './token.schema';
import { Model, Types } from 'mongoose';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Token.name)
        private tokenRepository: Model<TokenDocument>
    ) {}

    public async saveTokens(dto: CreateTokenDto) {
        const { user, tokens } = dto;
        const newToken = new Token();
        newToken.accessToken = tokens.accessToken;
        newToken.refreshToken = tokens.refreshToken;
        newToken.user = user;

        const createdToken = new this.tokenRepository(newToken);
        return createdToken.save();
    }

    public async getById(dto: Types.ObjectId) {
        const findToken = await this.tokenRepository.findById(dto);

        if (!findToken) {
            throw new HttpException('Токена не існує', HttpStatus.BAD_REQUEST);
        }
        return findToken;
    }

    public async getByName(token: string) {
        const findToken = await this.tokenRepository.findOne({ accessToken: token });

        if (!findToken) {
            throw new HttpException('Токена не існує', HttpStatus.BAD_REQUEST);
        }
        return findToken;
    }

    public async deleteToken(token: string) {
        const findToken = await this.getByName(token);
        await this.tokenRepository.findByIdAndDelete(findToken._id);
        return findToken;
    }

    //
    // public async getIdAccessToken(dto: string) {
    //     const findToken = await this.tokenRepository.findOne({ accessToken: dto });
    //     if (!findToken) {
    //         throw new HttpException('Токена не існує', HttpStatus.BAD_REQUEST);
    //     }
    //     return findToken._id;
    // }
    //
    // public async getIdRefreshToken(dto: string) {
    //     const findToken = await this.tokenRepository.findOne({ refreshToken: dto });
    //     if (!findToken) {
    //         throw new HttpException('Токена не існує', HttpStatus.BAD_REQUEST);
    //     }
    //     return findToken._id;
    // }
    //
    // public async deleteTokenById(dto: Types.ObjectId) {
    //     const findToken = await this.getById(dto);
    //     if (!findToken) {
    //         throw new HttpException('Токена не існує', HttpStatus.BAD_REQUEST);
    //     }
    //     await this.tokenRepository.findByIdAndDelete(dto);
    //     return findToken;
    // }
}
