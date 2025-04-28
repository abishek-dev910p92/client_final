<?php
function generateBillNumber($filePath) {
    // File number generation logic (same as previous script)
    $fileHandle = fopen($filePath, "c+");
    flock($fileHandle, LOCK_EX);
    $lastBillNumber = (int)fread($fileHandle, filesize($filePath) ?: 1);
    $newBillNumber = $lastBillNumber + 1;

    // Prepare PDF content
    $pdfContent = "%PDF-1.7\n";
    $pdfContent .= "1 0 obj\n";
    $pdfContent .= "<<\n";
    $pdfContent .= "/Type /Catalog\n";
    $pdfContent .= "/Pages 2 0 R\n";
    $pdfContent .= ">>\n";
    $pdfContent .= "endobj\n\n";

    $pdfContent .= "2 0 obj\n";
    $pdfContent .= "<<\n";
    $pdfContent .= "/Type /Pages\n";
    $pdfContent .= "/Kids [3 0 R]\n";
    $pdfContent .= "/Count 1\n";
    $pdfContent .= ">>\n";
    $pdfContent .= "endobj\n\n";

    $pdfContent .= "3 0 obj\n";
    $pdfContent .= "<<\n";
    $pdfContent .= "/Type /Page\n";
    $pdfContent .= "/Parent 2 0 R\n";
    $pdfContent .= "/Resources <<>>\n";
    $pdfContent .= "/MediaBox [0 0 612 792]\n";
    $pdfContent .= "/Contents 4 0 R\n";
    $pdfContent .= ">>\n";
    $pdfContent .= "endobj\n\n";

    $pdfContent .= "4 0 obj\n";
    $pdfContent .= "<<\n";
    $pdfContent .= "/Length 44\n";
    $pdfContent .= ">>\n";
    $pdfContent .= "stream\n";
    $pdfContent .= "BT\n";
    $pdfContent .= "/F1 24 Tf\n";
    $pdfContent .= "100 700 Td\n";
    $pdfContent .= "(Bill Number: $newBillNumber) Tj\n";
    $pdfContent .= "ET\n";
    $pdfContent .= "endstream\n";
    $pdfContent .= "endobj\n\n";

    $pdfContent .= "xref\n";
    $pdfContent .= "0 5\n";
    $pdfContent .= "0000000000 65535 f\n";
    $pdfContent .= "0000000009 00000 n\n";
    $pdfContent .= "0000000056 00000 n\n";
    $pdfContent .= "0000000111 00000 n\n";
    $pdfContent .= "0000000223 00000 n\n";

    $pdfContent .= "trailer\n";
    $pdfContent .= "<<\n";
    $pdfContent .= "/Size 5\n";
    $pdfContent .= "/Root 1 0 R\n";
    $pdfContent .= ">>\n";
    $pdfContent .= "startxref\n";
    $pdfContent .= "333\n";
    $pdfContent .= "%%EOF\n";

    // Create bills directory if not exists
    $billDir = 'bills/';
    if (!file_exists($billDir)) {
        mkdir($billDir, 0777, true);
    }

    // Save PDF
    $pdfFilePath = $billDir . 'bill_' . $newBillNumber . '.pdf';
    file_put_contents($pdfFilePath, $pdfContent);

    // Update bill number file
    ftruncate($fileHandle, 0);
    rewind($fileHandle);
    fwrite($fileHandle, $newBillNumber);
    flock($fileHandle, LOCK_UN);
    fclose($fileHandle);

    return json_encode([
        'status' => true,
        'bill_number' => $newBillNumber,
        'pdf_path' => $pdfFilePath
    ]);
}

// Execute and output
echo generateBillNumber('bill_number.txt');
?>