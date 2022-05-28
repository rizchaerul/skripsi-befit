/**
 * Convert base64 to Uint8Array.
 *
 * @param base64 Base64 string.
 */
function base64ToUint8Array(base64: string): Uint8Array {
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(b64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * Returns generated PushSubscription.
 */
export async function generatePushSubscription(): Promise<PushSubscription | null> {
    if (process.env.NODE_ENV === "development") {
        return null;
    }

    let pushSubscription: PushSubscription | null = null;

    try {
        const registration = await navigator.serviceWorker.ready;
        pushSubscription = await registration.pushManager.getSubscription();

        if (!pushSubscription) {
            pushSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: base64ToUint8Array(
                    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
                ),
            });
        }

        return pushSubscription;
    } catch (err) {
        console.error(err);
    }

    return pushSubscription;
}

/**
 * Unsubscribe to push notification if subscription exists.
 */
export async function unsubscribe(): Promise<void> {
    const registration = await navigator.serviceWorker.ready;
    const pushSubscription = await registration.pushManager.getSubscription();

    if (pushSubscription) {
        await pushSubscription.unsubscribe();
    }
}
