import { Account } from "next-auth";
import { JWT as BaseJWT } from "next-auth/jwt";

declare module "next-auth" {
    type JWT = BaseJWT & {
        isAdmin: boolean;
    };

    interface Session {
        token: JWT;
    }
}
