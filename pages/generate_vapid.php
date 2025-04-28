<?php
require '../vendor/autoload.php';

use Minishlink\WebPush\VAPID;

// Generate VAPID keys
$keys = VAPID::createVapidKeys();

echo "Public Key: " . $keys['publicKey'] . "<br>";
echo "Private Key: " . $keys['privateKey'];
?>
