self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: 'icon.png', // Path to your icon image
    badge: 'badge.png', // Path to your badge image
    vibrate: [200, 100, 200], // Vibration pattern (optional)
  };

  event.waitUntil(
    self.registration.showNotification('New Push Notification', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://yourwebsite.com') // URL to open on click
  );
});
