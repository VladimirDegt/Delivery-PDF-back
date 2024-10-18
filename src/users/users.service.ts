import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import { HttpException } from '@nestjs/common/exceptions';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { SaveTokenDto } from './dto/save-token.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userRepository: Model<UserDocument>
    ) {}

    async createUser(dto: CreateUserDto): Promise<User> {
        const candidate = await this.userRepository.findOne({
            email: dto.email,
        });
        if (candidate) throw new ConflictException('This email is already registered');
        const passwordHash = await bcrypt.hash(dto.password, 5);
        const user = new this.userRepository({
            username: dto.username,
            email: dto.email,
            password: passwordHash,
        });
        return user.save();
    }

    async getAllUsers() {
        return await this.userRepository.find().populate('roles');
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ email });
        if (!user) {
            throw new HttpException('Користувача не знайдено', HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    async checkUserForRegistration(email: string): Promise<void> {
        const user = await this.userRepository.findOne({ email });
        if (user) {
            throw new HttpException('Така пошта вже зареєстрована', HttpStatus.BAD_REQUEST);
        }
    }

    async saveTokens(dto: SaveTokenDto): Promise<User> {
        const user = await this.userRepository.findOne({
            email: dto.user.email,
        });
        if (!user) {
            throw new HttpException('Користувача з такою поштою не інсує', HttpStatus.BAD_REQUEST);
        }
        user.$set('tokens', dto.tokenId._id);
        return user.save();
    }

    async delete(dto: User) {
        const user = await this.userRepository.findById(dto);
        if (!user) {
            throw new HttpException('Користувача не інсує', HttpStatus.BAD_REQUEST);
        }
        await this.userRepository.findByIdAndDelete(dto);
        return user;
    }

    async deleteToken(dto: Types.ObjectId) {
        const user = await this.userRepository.findById(dto);
        if (!user) {
            throw new HttpException('Користувача не інсує', HttpStatus.BAD_REQUEST);
        }
        await this.userRepository.findByIdAndUpdate(dto, {
            tokens: [],
        });
        return user._id;
    }

    async getUserByIdToken(dto: Types.ObjectId): Promise<Types.ObjectId> {
        const user = await this.userRepository.findOne({ tokens: { $in: [dto] } });
        if (!user) {
            throw new HttpException('Користувача не інсує', HttpStatus.BAD_REQUEST);
        }
        return user._id;
    }

    async getUserByID(dto: Types.ObjectId): Promise<User> {
        const user = await this.userRepository.findById(dto);
        if (!user) {
            throw new HttpException('Користувача не інсує', HttpStatus.BAD_REQUEST);
        }
        return user;
    }
}
