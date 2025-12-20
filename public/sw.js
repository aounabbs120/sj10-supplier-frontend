// supplier_panel_frontend/public/sw.js

self.addEventListener('push', event => {
  const data = event.data.json();

  // --- UPGRADED OPTIONS ---
  const options = {
    body: data.body,
    icon: data.icon,       // The small icon
    badge: data.badge,     // The monochrome icon for the status bar (Android)
    image: data.image,     // The large preview image of the product
    data: {
      url: data.url
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});