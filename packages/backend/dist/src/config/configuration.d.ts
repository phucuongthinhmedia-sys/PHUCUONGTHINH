export declare class EnvironmentVariables {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    AWS_ACCESS_KEY_ID?: string;
    AWS_SECRET_ACCESS_KEY?: string;
    AWS_S3_BUCKET_NAME?: string;
    AWS_REGION: string;
    FRONTEND_URL?: string;
    CMS_URL?: string;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
declare const _default: (() => {
    nodeEnv: string;
    port: number;
    database: {
        url: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    aws: {
        accessKeyId: string;
        secretAccessKey: string;
        s3BucketName: string;
        region: string;
    };
    cdn: {
        baseUrl: string;
    };
    frontend: {
        url: string;
        cmsUrl: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    nodeEnv: string;
    port: number;
    database: {
        url: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    aws: {
        accessKeyId: string;
        secretAccessKey: string;
        s3BucketName: string;
        region: string;
    };
    cdn: {
        baseUrl: string;
    };
    frontend: {
        url: string;
        cmsUrl: string;
    };
}>;
export default _default;
