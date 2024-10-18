export function tokenTimeConfig() {
    return {
        secret: process.env.JWT_ACCESS_TOKEN || 'SECRET',
        signOptions: {
            expiresIn: '24h',
        },
    };
}
