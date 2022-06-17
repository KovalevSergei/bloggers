import basicAuth from 'express-basic-auth';

export const basicAuthMiddlewareBuilder = basicAuth({
    users:{ admin: 'qwerty'},
    challenge: true,
});

