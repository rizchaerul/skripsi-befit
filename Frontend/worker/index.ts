declare let self: ServiceWorkerGlobalScope;

/**
 * Event listener for push notification.
 */
self.addEventListener("push", (event) => {
    const data = JSON.parse(event?.data.text() || "{}");

    event?.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.message,
            icon: "/icons/android-chrome-192x192.png",
        })
    );
});

/**
 * Event listener for when user click the notification.
 */
self.addEventListener("notificationclick", (event) => {
    event?.notification.close();

    event?.waitUntil(
        self.clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then(function (clientList) {
                // console.log(clientList);

                for (let i = 0; i < clientList.length; i++) {
                    const client = clientList[i];

                    if (client?.url == "/notification" && "focus" in client) {
                        return client.focus();
                    }
                }

                if (self.clients.openWindow) {
                    return self.clients.openWindow("/notification");
                }
            })
    );
});

export {};
