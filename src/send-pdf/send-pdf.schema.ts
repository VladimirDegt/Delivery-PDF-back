import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.schema';

export type ActDocument = HydratedDocument<Act>;

@Schema({
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
})
export class Act {
    @ApiProperty({
        description: 'id користувача',
    })
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    @ApiProperty({
        example: 'example@gmail.com',
        description: 'Email customer',
    })
    @Prop()
    emailTo: string;

    @ApiProperty({
        example: 'Hello!',
        description: 'Text email',
    })
    @Prop()
    textEmail: string;

    @ApiProperty({ example: 'Аct_email_first', description: 'file name' })
    @Prop()
    fileName: string;

    @ApiProperty({ example: 'Sending successful', description: 'Description result after send' })
    @Prop()
    result: string;
}

export const ActSchema = SchemaFactory.createForClass(Act);
