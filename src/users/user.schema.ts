import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Token } from 'src/token/token.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
})
export class User {
    @ApiProperty({
        example: 'Volodymyr',
        description: "Ім'я користувача",
    })
    @Prop()
    username: string;

    @ApiProperty({
        example: 'example@gmail.com',
        description: 'Пошта користувача',
    })
    @Prop({ unique: true })
    email: string;

    @ApiProperty({ example: '12345', description: 'Пароль користувача' })
    @Prop()
    password: string;

    @ApiProperty({
        description: 'Токен користувача',
    })
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Token' }] })
    tokens: Token[];
}

export const UserSchema = SchemaFactory.createForClass(User);
