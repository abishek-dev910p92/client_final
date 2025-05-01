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

// Get the POST data from the frontend (JSON format)
$inputData = json_decode(file_get_contents("php://input"), true);

// Make sure the data is valid
if (isset($inputData['user_id'], $inputData['subscription']['endpoint'], $inputData['subscription']['keys']['p256dh'], $inputData['subscription']['keys']['auth'])) {
    $user_id = $inputData['user_id'];  // Use the user_id (cid) from the frontend

    $endpoint = $inputData['subscription']['endpoint'];
    $publicKey = $inputData['subscription']['keys']['p256dh'];
    $authToken = $inputData['subscription']['keys']['auth'];

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
    echo "❌ Invalid subscription data or missing user_id (cid).";
}
?>
