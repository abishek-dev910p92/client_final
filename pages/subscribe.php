<?php
// Get subscription POST data
$raw = file_get_contents("php://input");

// Save it to a file
file_put_contents("subscriptions.json", $raw);

// Respond
http_response_code(201);
echo "Subscribed successfully.";
?>
