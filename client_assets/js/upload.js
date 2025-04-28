const cameraInput = document.getElementById('cameraCaptureInput');

cameraInput.addEventListener('change', (event) => {
    const files = event.target.files;

    // Ensure there's at least one file captured
    if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        
        // Read the file as DataURL to preview the image
        reader.onload = function (e) {
            images.push(e.target.result); // Add image to the array
            addToCarousel(e.target.result); // Show the image in the carousel
            updatePreview(); // Update preview with form details
        };

        reader.readAsDataURL(file); // Convert captured image to DataURL for preview
    }
});

        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const captureButton = document.getElementById('captureButton');
        const submitButton = document.getElementById('submitButton');
        const uploadInput = document.getElementById('imageUploadInput');
        const carouselInner = document.getElementById('carouselInner');

        let images = [];
        const maxImages = 5;
 

        // Add image to carousel
        function addToCarousel(imageUrl) {
            const isActive = images.length === 1 ? 'active' : '';  // First image should be active
            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item ${isActive}`;
            carouselItem.innerHTML = `<img src="${imageUrl}" alt="Captured Image ${images.length}">`;
            carouselInner.appendChild(carouselItem);
        }

       // Handle image uploads (including camera captures)
uploadInput.addEventListener('change', (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length && images.length < maxImages; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function (e) {
            images.push(e.target.result); // Add captured image to the images array
            addToCarousel(e.target.result); // Show image preview in carousel
            updatePreview(); // Update form preview
        }
        reader.readAsDataURL(file); // Convert image to DataURL for preview
    }
});


submitButton.addEventListener('click', async () => {
    const formData = new FormData();

    // Add all images (from both file upload and camera) to FormData
    for (let i = 0; i < images.length; i++) {
        if (images[i].startsWith('data:')) {
            // Convert Data URL to Blob for captured images
            const response = await fetch(images[i]);
            const blob = await response.blob();
            formData.append(`image${i + 1}`, blob, `image_${i + 1}.png`);
        } else {
            formData.append(`image${i + 1}`, images[i]); // Add uploaded file images directly
        }
    }


    // Add the rest of the product details to FormData
    formData.append('title', document.getElementById('title').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('stock', document.getElementById('stock').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('colour', document.getElementById('colour').value);
    formData.append('size', document.getElementById('size').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('offer', document.getElementById('offer').value);
    formData.append('cid', document.getElementById('cid').value);
    formData.append('fname', document.getElementById('fname').value);
    
  
    try {
        const response = await fetch('upload_image_to_db.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById('uploadStatus').innerHTML = '<div class="alert alert-success">Uploaded successfully!</div>';
            alert("success")
        } else {
            document.getElementById('uploadStatus').innerHTML = '<div class="alert alert-danger">' + result.message + '</div>';
            alert("error")
        }                                                  
    } catch (error) {
        document.getElementById('uploadStatus').innerHTML = '<div class="alert alert-danger">An error occurred: ' + error.message + '</div>';
        alert("API error")
    }
});



        // Function to calculate offer and final price
        function calculateOfferPrice() {
            const price = parseFloat(document.getElementById('price').value) || 0;
            const offer = parseFloat(document.getElementById('offer').value) || 0;

            const finalPrice = price - (price * (offer / 100));
            document.getElementById('strikePrice').textContent = price ? price.toFixed(2) : '';
            document.getElementById('finalPricePreview').textContent = finalPrice.toFixed(2);
            updatePreview();
        }

        // Update preview section
        function updatePreview() {
            document.getElementById('previewTitle').textContent = document.getElementById('title').value;
            document.getElementById('previewPrice').textContent = document.getElementById('price').value;
            document.getElementById('previewStock').textContent = document.getElementById('stock').value;
            document.getElementById('previewCategory').textContent = document.getElementById('category').value;
            document.getElementById('previewColour').textContent = document.getElementById('colour').value;
            document.getElementById('previewSize').textContent = document.getElementById('size').value;
            document.getElementById('previewDescription').textContent = document.getElementById('description').value;
            document.getElementById('previewOffer').textContent = document.getElementById('offer').value;
            document.getElementById('previewFinalPrice').textContent = document.getElementById('finalPricePreview').textContent.replace('₹', '');
        }