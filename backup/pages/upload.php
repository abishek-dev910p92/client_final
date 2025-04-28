<?php
// Adjust PHP settings to allow larger file uploads
ini_set('upload_max_filesize', '64M');
ini_set('post_max_size', '64M');

$uploadsDirectory = 'uploads/';

// Check if the 'uploads' folder exists, and if not, create it
if (!file_exists($uploadsDirectory)) {
    mkdir($uploadsDirectory, 0777, true); // Create the folder with full permissions
}

if(isset($_FILES['fileInput'])){
    $fileInputs = $_FILES['fileInput'];
    $fileNames = array();
    $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']; // Define allowed MIME types
    $maxFileSize = 64 * 1024 * 1024; // 64MB in bytes

    // Loop through each file input
    for ($i = 0; $i < count($fileInputs['name']); $i++) {
        if(isset($fileInputs['name'][$i]) && $fileInputs['error'][$i] === UPLOAD_ERR_OK) {
            $fileName = basename($fileInputs['name'][$i]); // Strip directory info if any
            $fileTmpName = $fileInputs['tmp_name'][$i];
            $fileSize = $fileInputs['size'][$i];
            $fileError = $fileInputs['error'][$i];
            
            $fileMimeType = mime_content_type($fileTmpName);
            $fileInfo = pathinfo($fileName);
            $safeFileName = preg_replace("/[^a-zA-Z0-9\.\-_]/", "_", $fileInfo['filename']) . '.' . $fileInfo['extension']; // Sanitize file name
            $destination = $uploadsDirectory . DIRECTORY_SEPARATOR . $safeFileName;

            // Validate file type
            if (!in_array($fileMimeType, $allowedMimeTypes)) {
                echo "Invalid file type for '$fileName'.<br>";
                continue;
            }

            // Validate file size
            if ($fileSize > $maxFileSize) {
                echo "File '$fileName' is too large.<br>";
                continue;
            }

            // Move the uploaded file to the destination directory
            if (move_uploaded_file($fileTmpName, $destination)) {
                chmod($destination, 0644); // Set file permissions
                $fileNames[] = $destination; // Add file name to the array
            } else {
                echo "Error moving uploaded file '$fileName'.<br>";
            }
        } else {
            // Handle file errors
            switch ($fileError) {
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    echo "File '$fileName' exceeds the allowed size.<br>";
                    break;
                case UPLOAD_ERR_PARTIAL:
                    echo "File '$fileName' was only partially uploaded.<br>";
                    break;
                case UPLOAD_ERR_NO_FILE:
                    echo "No file was uploaded.<br>";
                    break;
                case UPLOAD_ERR_NO_TMP_DIR:
                    echo "Missing temporary folder for '$fileName'.<br>";
                    break;
                case UPLOAD_ERR_CANT_WRITE:
                    echo "Failed to write file '$fileName' to disk.<br>";
                    break;
                default:
                    echo "Unknown error occurred with file '$fileName'.<br>";
            }
        }
    }

    // Return JSON response with file names
    header('Content-Type: application/json');
    echo json_encode(['uploaded_files' => $fileNames]);
}
?>
