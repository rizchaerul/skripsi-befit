import NextAuth, { JWT } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createApiClient } from "../../../src/functions/create-api-client";

export default NextAuth({
    pages: {
        signIn: "/auth/login",
    },

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                // email: { label: "email", type: "email" },
                // password: { label: "password", type: "password" },
                email: { label: "email", type: "email" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials) {
                // console.log(credentials);
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const result = await createApiClient().userAccount_Login({
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const user: JWT = {
                        sub: result.userAccountId,
                        name: result.fullName,
                        email: result.email,
                        isAdmin: result.isAdmin,
                        picture: result.pictureBase64,
                    };

                    return user;
                } catch (err) {
                    console.error(err);
                }

                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
        // Three months.
        maxAge: 60 * 60 * 24 * 30 * 3,
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
        async session({ session, token }) {
            const typedToken = token as JWT;

            return {
                ...session,
                token: typedToken,
            };
        },
        async jwt({ token, user }) {
            if (user) {
                return user;
            }

            return token;
        },
    },
});
