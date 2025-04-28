<?php
// Set response header to JSON
header('Content-Type: application/json');

// Check if a file is uploaded
if (isset($_FILES['pdf']) && $_FILES['pdf']['error'] === UPLOAD_ERR_OK) {
    // Define the target directory
    $targetDir = __DIR__ . '/bills/';

    // Ensure the directory exists
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    // Get the uploaded file details
    $fileName = basename($_FILES['pdf']['name']);
    $targetFilePath = $targetDir . $fileName;

    // Move the uploaded file to the target directory
    if (move_uploaded_file($_FILES['pdf']['tmp_name'], $targetFilePath)) {
        // Return the file path in the response
        echo json_encode([
            'status' => 'success',
            'filePath' => $targetFilePath,
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to save the file.',
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'No file uploaded or there was an error during the upload.',
    ]);
}
?>
