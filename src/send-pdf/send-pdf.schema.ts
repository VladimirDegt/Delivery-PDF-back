import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

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
        example: 'Volodymyr',
        description: 'user name',
    })
    @Prop()
    user: string;

    @ApiProperty({
        example: 'example@gmail.com',
        description: 'Email customer',
    })
    @Prop()
    emailTo: string;

    @ApiProperty({
        example: 'example@gmail.com',
        description: 'Email sender',
    })
    @Prop()
    emailFrom: string;

    @ApiProperty({ example: 'Аct_email_first', description: 'file name' })
    @Prop()
    fileName: string;

    @ApiProperty({ example: 'Sending successful', description: 'Description result after send' })
    @Prop()
    result: string;
}

export const ActSchema = SchemaFactory.createForClass(Act);
