<?php
// Database connection settings
$host = 'localhost';   // Database host
$dbname = 'u473959262_minitgo';  // Database name
$username = 'u473959262_minitgo'; // Your database username
$password = 'Minitzgo#2025';  // Your database password
session_start(); // Start the session

// Create a PDO instance for database connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Get the subscription POST data
$subscriptionData = json_decode(file_get_contents("php://input"), true);

// Make sure the data is valid
if (isset($subscriptionData['endpoint'], $subscriptionData['keys']['p256dh'], $subscriptionData['keys']['auth'])) {
    $user_id = 1;  // For now, set a static user ID. This should come from your user management system.

    $endpoint = $subscriptionData['endpoint'];
    $publicKey = $subscriptionData['keys']['p256dh'];
    $authToken = $subscriptionData['keys']['auth'];

    // Prepare the SQL query to insert the subscription into the database
    $sql = "INSERT INTO subscriptions (user_id, endpoint, publicKey, authToken) 
            VALUES (:user_id, :endpoint, :publicKey, :authToken)
            ON DUPLICATE KEY UPDATE
            endpoint = :endpoint, publicKey = :publicKey, authToken = :authToken";

    // Prepare the statement and bind the parameters
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':endpoint', $endpoint);
    $stmt->bindParam(':publicKey', $publicKey);
    $stmt->bindParam(':authToken', $authToken);

    // Execute the statement
    if ($stmt->execute()) {
        echo "✅ Subscribed successfully to push notifications!";
    } else {
        echo "⚠️ Failed to save subscription on server.";
    }
} else {
    echo "❌ Invalid subscription data.";
}
?>
