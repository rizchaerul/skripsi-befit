import {
    signIn as signInNextAuth,
    signOut as signOutNextAuth,
    SignOutParams,
} from "next-auth/react";
import { WebPushConstants } from "../constants/WebPushConstants";
import { unsubscribe } from "./push-subscription";

/**
 * Sign in.
 */
export async function signIn(): Promise<void> {
    await signInNextAuth(undefined, {
        callbackUrl: "/home",
    });
}

/**
 * Sign out.
 */
export async function signOut(
    options?: SignOutParams<true> | undefined
): Promise<void> {
    localStorage.removeItem(WebPushConstants.subscriptionKey);

    try {
        const regist = await navigator.serviceWorker.getRegistrations();

        if (regist.length !== 0) {
            await unsubscribe();
            console.log("unsubscribed!");
        }
    } catch (err) {
        console.error(err);
    }

    await signOutNextAuth(options);
}
