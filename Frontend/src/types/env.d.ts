namespace NodeJS {
    interface ProcessEnv extends NodeJS.ProcessEnv {
        NEXT_WEB_API_HOST: string;

        NEXTAUTH_SECRET: string;
        NEXTAUTH_AUTHORITY: string;
        NEXTAUTH_CLIENT_ID: string;
        NEXTAUTH_CLIENT_SECRET: string;
        NEXTAUTH_AUDIENCE: string;

        NEXT_PUBLIC_URL: string;
        NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY: string;
    }
}
