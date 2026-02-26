import { Env } from './env.validation';

export default () => {
    const env = process.env as unknown as Env;

    return {
        port: env.PORT,
        environment: env.NODE_ENV,
        database: {
            url: env.DATABASE_URL,
        },
    };
};