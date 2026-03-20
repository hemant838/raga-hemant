export const registerAppServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  return navigator.serviceWorker.register("/sw.js");
};

export const requestNotificationAccess = async (): Promise<NotificationPermission | "unsupported"> => {
  if (!("Notification" in window)) {
    return "unsupported";
  }

  if (Notification.permission === "default") {
    return Notification.requestPermission();
  }

  return Notification.permission;
};

export const showCareNotification = async (
  title: string,
  body: string,
  path = "/"
): Promise<boolean> => {
  if (!("serviceWorker" in navigator) || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission !== "granted") {
    return false;
  }

  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification(title, {
    body,
    icon: "/mark.svg",
    badge: "/mark.svg",
    tag: "raga-local-alert",
    data: { path }
  });

  return true;
};
