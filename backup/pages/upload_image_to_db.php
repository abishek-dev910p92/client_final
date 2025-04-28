<?php
header('Content-Type: application/json');

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "minitzgo";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection and return JSON error
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Initialize image paths
$imagePaths = [];
$targetDir = "uploads/";

// Create the uploads directory if it doesn't exist
if (!file_exists($targetDir)) {
    if (!mkdir($targetDir, 0777, true)) {
        echo json_encode(['success' => false, 'message' => 'Failed to create uploads directory.']);
        exit;
    }
}

// Loop through image uploads with unique naming including timestamp
for ($i = 1; $i <= 5; $i++) {
    if (isset($_FILES["image{$i}"]) && $_FILES["image{$i}"]["error"] == UPLOAD_ERR_OK) {
        $originalName = pathinfo($_FILES["image{$i}"]["name"], PATHINFO_FILENAME); // Get the original filename without extension
        $extension = pathinfo($_FILES["image{$i}"]["name"], PATHINFO_EXTENSION); // Get the file extension
        $timestamp = time(); // Get the current timestamp
        $uniqueName = $originalName . '_' . $timestamp . '_' . uniqid() . '.' . $extension; // Create a unique filename with timestamp
        $targetFilePath = $targetDir . $uniqueName;

        // Move the uploaded file to the server
        if (move_uploaded_file($_FILES["image{$i}"]["tmp_name"], $targetFilePath)) {
            $imagePaths[] = $targetFilePath; // Store the file path
        } else {
            echo json_encode(['success' => false, 'message' => "Failed to move image {$i}."]);
            exit;
        }
    } else {
        echo json_encode(['success' => false, 'message' => "No image {$i} uploaded or there was an error."]);
        exit;
    }
}

// Get additional product details
$title = $_POST['title'] ?? 0;
$price = $_POST['price'] ?? 0;
$offer = $_POST['offer'] ?? 0;
$stock = $_POST['stock'] ?? 0;
$category = $_POST['category'] ?? '';
$colour = $_POST['colour'] ?? '';
$size = $_POST['size'] ?? '';
$description = $_POST['description'] ?? '';
$cid = $_POST['cid'] ?? '';
$client_name = $_POST['fname'] ?? '';

// Prepare the SQL statement to insert image paths and product details into the database
$query = "INSERT INTO products (image1, image2, image3, image4, image5, title, price, offer, stock, category, size, colour, description, cid, client_name) 
          VALUES (?, ?,  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);

// Check if the statement was prepared successfully
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Statement preparation failed: ' . $conn->error]);
    exit;
}

// Bind parameters and execute statement
$stmt->bind_param('sssssssssssssss', $imagePaths[0], $imagePaths[1], $imagePaths[2], $imagePaths[3], $imagePaths[4], $title, $price, $offer, $stock, $category, $size, $colour, $description, $cid, $client_name);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Images and product details uploaded successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Database insertion failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
