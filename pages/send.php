<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Important: go one folder back "../"
require __DIR__ . '/../vendor/autoload.php'; 

use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Database connection settings
$host = 'localhost';   // Database host
$dbname = 'u473959262_minitgo';  // Database name
$username = 'u473959262_minitgo'; // Your database username
$password = 'Minitzgo#2025';  // Your database password


// Create a PDO instance for database connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
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
$notification = [
    'title' => '🚀 New Update!',
    'body' => 'Check out new order!',
    'url' => 'https://example.com',  // URL to open when the notification is clicked
    'icon' => 'icon.png',  // make sure you have an icon file or a URL
    'badge' => 'badge.png',  // optional: a smaller icon
    'sound' => 'default',  // hint for mobile devices
];

// Fetch subscriptions from database (you can modify this query to target specific users)
$user_id = 1;  // For example, send to user with ID = 1
$sql = "SELECT * FROM subscriptions WHERE user_id = :user_id";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':user_id', $user_id);
$stmt->execute();

// Loop through subscriptions and send notifications
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $subscriptionObj = Subscription::create([
        'endpoint' => $row['endpoint'],
        'publicKey' => $row['publicKey'],
        'authToken' => $row['authToken'],
    ]);

    // Send the push notification
    $webPush->queueNotification($subscriptionObj, json_encode($notification));
}

foreach ($webPush->flush() as $report) {
    $endpoint = $report->getRequest()->getUri()->__toString();

    if ($report->isSuccess()) {
        echo "✅ Success: Message sent to {$endpoint}<br>";
    } else {
        echo "❌ Failure: Message failed for {$endpoint}: {$report->getReason()}<br>";
        // Optional: Add more details for debugging:
        error_log('Push notification failure: ' . $report->getReason());
    }
}

?>
