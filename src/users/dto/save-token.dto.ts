import { User } from '../user.schema';
import { Types } from 'mongoose';

export class SaveTokenDto {
    readonly user: User;
    readonly tokenId: Types.ObjectId;
}
