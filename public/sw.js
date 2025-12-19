// public/sw.js

// This event is triggered when a push notification is received from the server.
self.addEventListener('push', event => {
  // The server sends data as a JSON string, so we parse it.
  const data = event.data.json();

  // These are the options for the notification that will appear on the user's device.
  const options = {
    body: data.body, // The main text of the notification
    icon: data.icon, // A URL to an icon (e.g., your app's logo)
    badge: data.icon, // An icon for Android devices
    data: {
      url: data.url // The URL to open when the notification is clicked
    }
  };

  // Tell the service worker to show the notification.
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// This event is triggered when the user clicks on the notification.
self.addEventListener('notificationclick', event => {
  // Close the notification.
  event.notification.close();
  
  // Open the URL that was passed in the data.
  // This allows you to deep-link users directly to an order or a chat.
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});