self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {};
  const title = payload.title || "RAGA Alert";
  const options = {
    body: payload.body || "A new care coordination update is available.",
    icon: "/mark.svg",
    badge: "/mark.svg",
    tag: payload.tag || "raga-push",
    data: payload.data || { path: "/analytics" }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const path = event.notification.data?.path || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const matchingClient = clients.find((client) => "focus" in client);

      if (matchingClient) {
        matchingClient.navigate(path);
        return matchingClient.focus();
      }

      return self.clients.openWindow(path);
    })
  );
});
