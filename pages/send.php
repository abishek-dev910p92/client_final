<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Important: go one folder back "../"
require __DIR__ . '/../vendor/autoload.php'; 

use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

// Load subscription
if (!file_exists(__DIR__ . '/subscriptions.json')) {
    die('Error: subscriptions.json file not found');
}
$subscription = json_decode(file_get_contents(__DIR__ . '/subscriptions.json'), true);
if ($subscription === null) {
    die('Error: Invalid JSON in subscriptions.json');
}

// Load VAPID keys
if (!file_exists(__DIR__ . '/vapid.json')) {
    die('Error: vapid.json file not found');
}
$vapid = json_decode(file_get_contents(__DIR__ . '/vapid.json'), true);
if ($vapid === null || !isset($vapid['publicKey']) || !isset($vapid['privateKey'])) {
    die('Error: Invalid VAPID key configuration');
}

// Setup authentication
$auth = [
    'VAPID' => [
        'subject' => 'mailto:abishek@minitzgo.com',
        'publicKey' => $vapid['publicKey'],
        'privateKey' => $vapid['privateKey'],
    ],
];

// Initialize WebPush object
$webPush = new WebPush($auth);

// Create the notification content
// Create the notification content
$notification = [
    'title' => '🚀 New Update!',
    'body' => 'You have a new message.',
    'sound' => 'default',  // Add this line to include sound
];


// Create the Subscription object
$subscriptionObj = Subscription::create([
    'endpoint' => $subscription['endpoint'],
    'publicKey' => $subscription['keys']['p256dh'],
    'authToken' => $subscription['keys']['auth'],
]);

// Send the push notification
$webPush->queueNotification(
    $subscriptionObj,
    json_encode($notification)
);

// Make sure all notifications are sent
foreach ($webPush->flush() as $report) {
    $endpoint = $report->getRequest()->getUri()->__toString();

    if ($report->isSuccess()) {
        echo "✅ Success: Message sent to {$endpoint}<br>";
    } else {
        echo "❌ Failure: Message failed for {$endpoint}: {$report->getReason()}<br>";
    }
}
?>
