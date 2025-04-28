self.addEventListener('push', function(event) {
  const data = event.data.json();
  console.log('Push received:', data);

  const options = {
    body: data.body,
    icon: data.icon || 'icon.png',
    badge: data.badge || 'badge.png',
    data: { url: data.url },
    sound: data.sound || 'default',  // Add sound property (you can provide your own sound file)
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
