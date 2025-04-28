<?php
// Define the file path for storing the last generated bill number
$billFilePath = 'bill_number.txt';

// Check if the bill number file exists; if not, create it with an initial value
if (!file_exists($billFilePath)) {
    file_put_contents($billFilePath, 1001); // Starting bill number
}

// Function to generate the next unique bill number
function generateBillNumber($filePath) {
    // Open the file for reading and writing
    $fileHandle = fopen($filePath, "c+"); // "c+" mode for reading and writing, creates file if it doesn't exist
    if (!$fileHandle) {
        return json_encode(array('status' => false, 'message' => 'Unable to open file.'));
    }

    // Lock the file to prevent concurrent access
    flock($fileHandle, LOCK_EX);

    // Read the current bill number from the file
    $lastBillNumber = (int)fread($fileHandle, filesize($filePath) ?: 1);

    // Increment the bill number
    $newBillNumber = $lastBillNumber + 1;

    // Move the file pointer to the beginning and update with the new bill number
    ftruncate($fileHandle, 0); // Clear the file content
    rewind($fileHandle);       // Reset file pointer to beginning
    fwrite($fileHandle, $newBillNumber);

    // Unlock and close the file
    flock($fileHandle, LOCK_UN);
    fclose($fileHandle);

    // Return success response with the new bill number
    return json_encode(array(
        'status' => true,
        'bill_number' => $newBillNumber
    ));
}

// Output the generated bill number
echo generateBillNumber($billFilePath);
?>
