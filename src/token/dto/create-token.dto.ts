import { User } from '../../users/user.schema';

interface ITokens {
    refreshToken: string;
    accessToken: string;
}
export class CreateTokenDto {
    readonly user: User;
    readonly tokens: ITokens;
}

export type TokenOnly = {
    token: string;
};
