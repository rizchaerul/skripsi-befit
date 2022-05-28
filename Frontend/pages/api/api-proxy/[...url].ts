import { IncomingHttpHeaders } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

interface IToken {
    accessToken?: string;
    expires_at?: number;
}

// Global module variable.
let token: IToken = {};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req });
    const url = req.url?.slice(15);

    if (
        session ||
        // Whitelisted endpoint.
        (url === "api/UserAccount/sign-up" && req.method === "POST") ||
        (url === "api/UserAccount/login" && req.method === "POST")
    ) {
        const token = await getToken();

        req.headers["authorization"] = `Bearer ${token}`;

        // console.log(req.headers["authorization"]);

        if (session?.token.sub) {
            req.headers["identifier"] = session.token.sub;
            req.headers["from"] = session.token.sub;
            // console.log(req.headers);
        }

        delete req.headers["host"];

        const response = await fetch(
            `${process.env.NEXT_WEB_API_HOST}/${url}`,
            {
                method: req.method,
                body: getBody(req.headers, req.body),
                headers: req.headers as HeadersInit,
            }
        );

        res.status(response.status).send(response.body);
    } else {
        return res.status(401).send({
            type: "https://tools.ietf.org/html/rfc7235#section-3.1",
            title: "Unauthorized",
            status: 401,
        });
    }
}

function getBody(headers: IncomingHttpHeaders, body: any) {
    if (headers["content-type"] === "application/json") {
        return JSON.stringify(body);
    }

    return body ? body : undefined;
}

export async function getToken() {
    if (token.accessToken && token.expires_at) {
        const isExpired = Date.now() >= token.expires_at * 1000;

        if (!isExpired) {
            return token.accessToken;
        }
    }

    let res = await fetch(
        `${process.env.NEXTAUTH_AUTHORITY}/.well-known/openid-configuration`
    );

    const { token_endpoint } = await res.json();

    // IdentityServer4
    // const form = new URLSearchParams();
    // form.append("client_id", process.env.NEXTAUTH_CLIENT_ID);
    // form.append("client_secret", process.env.NEXTAUTH_CLIENT_SECRET);
    // form.append("grant_type", "client_credentials");
    // form.append("scope", "api");

    // res = await fetch(token_endpoint, {
    //     method: "POST",
    //     body: form,
    //     headers: {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //     },
    // });

    // Auth0
    const body = {
        client_id: process.env.NEXTAUTH_CLIENT_ID,
        client_secret: process.env.NEXTAUTH_CLIENT_SECRET,
        audience: process.env.NEXTAUTH_AUDIENCE,
        grant_type: "client_credentials",
    };

    res = await fetch(token_endpoint, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await res.json();

    token = {
        accessToken: data["access_token"],
        expires_at: Math.round(Date.now() / 1000) + <number>data["expires_in"],
    };

    return token.accessToken;
}
