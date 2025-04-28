var win = navigator.platform.indexOf('Win') > -1;
if (win && document.querySelector('#sidenav-scrollbar')) {
    var options = {
        damping: '0.5'
    }
    Scrollbar.init(document.querySelector('#sidenav-scrollbar'), options);
}


// Declare cid globally
let cid;

const dbUserJSON = localStorage.getItem('dbUser');

if (dbUserJSON) {
    const dbUser = JSON.parse(dbUserJSON);
    cid = dbUser.cid;
    coordinates = dbUser.coordinates;
    // console.log("check cid", cid);
} else {
    // console.log("dbUser not found in local storage");
}

const showcid = document.getElementById("cid");
showcid.value = cid;

// full clientname getting 
let fname;

const clientdb = localStorage.getItem('dbUser');

if (clientdb) {
    const cdbUser = JSON.parse(clientdb);
    const cfname = cdbUser.first_name;
    const clname = cdbUser.last_name;
    fname = cfname + " " + clname;  // Combine first and last name with a space
    // console.log("check fname:", fname);

    // Set the full name to the input field
    const cfullname = document.getElementById("fname");
    cfullname.value = fname;
} else {
    // console.log("dbUser not found in local storage");
}

// Now cid is accessible globally in this script

$(document).ready(function () {

    const products = [];
    fetch('https://minitzgo.com/api/fetch_products.php', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "x-api-key": "2637338988c5f3bbf8d4934dc458b966a21a1d2d56931390f97ce7c4641a2677"
        },
        body: {
            'cid': cid
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            if (data.status === false) {
                // console.log(data.message);
            } else {

                const clientdata = data.data.filter(product => product.cid == cid);
                products.push(...clientdata)
                renderProducts(products)

            }

        })
        .catch((error) => {
            // console.error('Error in fetching data:', error);
        });

    const searchInput = document.querySelector(".form-control");
    let searchValue = '';

    searchInput.addEventListener("input", () => {
        searchValue = searchInput.value.trim().toLowerCase();
        // console.log("Searchvalue", searchValue)

        if (searchValue !== "") {
            const menRegex = /^(men|man|mens|men's)/;
            if (menRegex.test(searchValue)) {
                filteredProducts = products.filter(
                    (product) =>
                        product.product_name.toLowerCase().startsWith("men")
                );
                // console.log("FILTERED:", filteredProducts)
                renderProducts(filteredProducts)
            } else {
                filteredProducts = products.filter((product) =>
                    product.product_name.toLowerCase().includes(searchValue)
                );
                // console.log("FILTERED:", filteredProducts)
                renderProducts(filteredProducts); // Render filtered products
            }

        } else {
            renderProducts(products); // If input is empty, render all products

        }
    });



     //product card start  changes3

 function renderProducts(allProducts) {

    let productHTML = '';


    if (allProducts.length === 0) {

        // Build the HTML markup for the product
        productHTML += "<div class='col-xl-3 col-md-6 mb-xl-0 mb-4 my-2 r '>";
        productHTML += "<div class='card card-blog card-plain '>";
        productHTML += "<div class='card-body px-1 pb-0'>";
        productHTML +="<p class='text-center m-2 text-2xl border border-secondary text-danger p-2 rounded'>" + "No Result" +"</p>"; 

        //Product description here
        productHTML += "</div>";
        productHTML += "</div>";
        productHTML += "</div>";
        let data=$("#product").html(productHTML);
         return
       
        
    }


    allProducts.forEach((product, index) => {
        // if (product.client_id == clientid)
        // if (product.client_id) {
        if (product) {
            const carouselId = 'carouselExampleControls' + index;
            // Build the HTML markup for the product

            // <!-- card - 1 start   -->
            productHTML += "<div class='cards-container'>";
            // // <!-- card-sub-container -->
            productHTML += " <div class='card-sub-container'>";
            //<!-- product-img-main-container start -->
            productHTML +="<div class='product-img-main-container '>";
            //<!-- product-img-link-start -->
            productHTML +="  <a class='product-img-link'>";
            // <!-- card-img-container start -->
            productHTML += "<div id='" + carouselId + "' class='carousel slide' data-bs-ride='carousel'>";
            productHTML += "<div class='carousel-inner'>";
         
            for (let i = 1; i <= 6; i++) {
                if (product['product_image' + i]) {
                // poducts-img
                    productHTML += "<div class='carousel-item" + (i === 1 ? " active" : "") + "'>";
                    productHTML += "<img src='" + product['product_image' + i] + "' class='poducts-img img-fluid fixed-size-image border-radius-xl p-1' alt='Product Image'>";
                    productHTML += "</div>";
                }
            }
            productHTML += "</div>";

            // <!-- card-img-Button 1  -->
            productHTML += "<button class='carousel-control-prev position-absolute' style='height: 50px; top:45%' type='button' data-bs-target='#" + carouselId + "' data-bs-slide='prev'>"; productHTML += "<span class='carousel-control-prev-icon' aria-hidden='true'></span>";
            productHTML += "<span class='visually-hidden'>Previous</span>";
            productHTML += "</button>";
            // <!-- card-img-Button 2 -->
            productHTML += "<button class='carousel-control-next position-absolute'  style='height: 50px; top:45%' type='button' data-bs-target='#" + carouselId + "' data-bs-slide='next'>";
            productHTML += "<span class='carousel-control-next-icon' aria-hidden='true'></span>";
            productHTML += "<span class='visually-hidden'>Next</span>";
            productHTML += "</button>";
            productHTML += "</div>"; // Product image here
            productHTML += "</a>";
            // <!-- card-img-link-end  -->

            productHTML += "</div>";
            // <!-- card-img-main-container End -->

            // <!-- product all details start -->
            productHTML += "<div class='product-details-container'>";

            const productDate = product.date instanceof Date ? product.date : new Date(product.date);
            // Check if the product is less than or equal to 2 days old
            const currentDate = new Date();
            const timeDifference = Math.abs(currentDate.getTime() - productDate.getTime());
            const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
            if (daysDifference <= 5) {
                // <!-- NOT KNOW ******************  -->
                productHTML += "<div class='d-flex gap-3'>";
                productHTML += "<p class='text-xs text-disabled'>" + product.category + "</p>";
                productHTML += "<p class='badge bg-primary'>New</p>";
                productHTML += "</div>";

                productHTML += "<div class='d-flex gap-3'>";
                productHTML += "<p class='text-xs'>" + product.client_name + "</p>";
                productHTML += "</div>";
            } else {
                // <!-- product title  --> 
                productHTML += "<div class='product-title-box'>";
                productHTML += "<h6  class='product-title'>" + product.product_title + "</h6>";
                productHTML += "</div>";

                // <!-- product sellecr details -->
                productHTML += "<div class='product-seller-box'>";
                productHTML += "<p class='product-seller-name'> <b>Seller</b>: " + product.client_name + "</p>";
                productHTML += "<p class='product-seller-id'><b>Id</b>: " + product.cid + "</p>";
                productHTML += "</div>";

                // <!-- product details -->
                productHTML += "<div class='product-details-box'>";
                productHTML += "<p class='product-num' ><b>Product: " + product.pid + " </b></p>";
                productHTML += "<p class='product-code' ><b>Pcode: " + product.pcode + "</b></p>";
                productHTML += "</div>";
            }
            // <!-- product categorys -->
            productHTML += "<div class='product-categorys-box'>";
            productHTML += "<p class='product-categorys-types'><b>category:</b> " + product.category + "</p>";
            productHTML += "<div class='product-categorys-color-box'>";
            productHTML += "<p class='product-categorys-color'><b>colour:</b> " + product.product_color1 + " </p>";
            
            if (product.product_color2 !== "") {
                productHTML += "<p class='product-categorys-color2'> | " + product.product_color2 + "</p>";
            }
            productHTML += "</div>";
            
            productHTML += "</div>";

            // <!-- product brand details -->
            productHTML += "<div class='product-brand-details-box'>";
            productHTML += "<p class='product-brand'> <b>Brand:</b> " + product.product_brand + "</p>";
            productHTML += "<p class='product-price'> <b>Price:</b>" + product.product_price + "₹</p>";
            productHTML += "</div>";

            // <!-- product material and offer details  -->
            productHTML += "<div class='product-materialOffer-details-box'>";
            productHTML += "<p class='product-material' ><b>material:</b> " + product.material + "</p>";
            productHTML += "<p class='product-offers'><b>Offer:</b>" + product.offers + "%</p>";
            productHTML += "<p class='product-size'><strong>Size:</strong> " + product.product_size + "</p>";
            productHTML += "</div>";

            // <!-- product Instock button -->
            productHTML += "<div class='product-instock-btn-box'>";
            productHTML += "<button type='button' class='product-instock-btn-in' onclick='updateStock(\"" + product.pid + "\", \"decrease\")' style='border:none'> -</button>";
            productHTML += "<span class='text-sm'><strong>InStock:</strong><span id='stock-" + product.pid + "'> " + product.product_stock + "</span></span>";
            productHTML += "<button type='button' class='product-instock-btn-de' onclick='updateStock(\"" + product.pid + "\", \"increase\")' style='border:none'>+</button>";
            productHTML += "</div>";
            // <!-- product description -->
            const description = product.product_discription;
            const truncatedDescription = description.length > 58 ? description.slice(0, 80) + '...' : description;
            
            productHTML+= "<div class='product-desc-box'>";
            productHTML += "<p class='product-desc'><b> Description:</b> " + truncatedDescription + "</p>";
            productHTML += "</div>"; 
            
            // <!-- product all details end  -->
            productHTML += "</div>";

            // <!-- product Boost Delete btn  -->
            productHTML +="<div class='product-boostdelete-btn-box'>";
            productHTML +="<button type='button' class='btn disabled bg-secondary btn-sm mb-0' onclick='openEditModal(\"" + product.id + "\")'>Boost </button>";
            productHTML +="<button type='button' class='btn btn-danger btn-sm mb-0' onclick='deleteProduct(\"" + product.pid + "\")'>Delete</button>";
            productHTML += "</div>";

            // <!-- card-sub-container  -->
            productHTML += "</div>";
            
            // <!-- card - 1 end   -->
            productHTML += "</div>";

            // productHTML += "<h5 class='font-weight-bolder'>" + product.id + "</h5>";

        }
    });
    
     $("#product").html(productHTML);


    

}

});

//    product card end   changes3

function deleteProduct(pid) {
    // Ask for confirmation
    if (confirm("Are you sure you want to delete this product?")) {
        const apiUrl = 'https://minitzgo.com/api/delete_products.php';
        const apiKey = 'afb5678cd20a7bc0eabcc16ddfab114c2ae58321766974b55f03bfbb9a19c55b'; // Replace with your actual API key

        $.ajax({
            url: apiUrl,
            type: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ pid: pid }),
            success: function (response) {
                // Handle success response
                // console.log('Product deleted successfully:', response);
                // Reload the page after deletion
                location.reload();
            },
            error: function (xhr, status, error) {
                // Handle error response
                // console.error('Error deleting product:', error);
            }
        });
    }
}

//stock update function
function updateStock(productId, action) {
    // Get the current stock value
    let stockElement = document.querySelector(`#stock-${productId}`);
    let currentStock = parseInt(stockElement.innerText);

    // Adjust stock based on the action
    if (action === 'increase') {
        currentStock += 1;
    } else if (action === 'decrease' && currentStock > 0) {
        currentStock -= 1;
    }

    // Update the stock value in the UI instantly
    stockElement.innerText = currentStock;

    // Prepare the data to send
    let data = {
        pid: productId,
        stock: currentStock,
    };

    // Send the AJAX request to the API
    $.ajax({
        url: 'https://minitzgo.com/api/stockupdate.php',  // Replace with your API endpoint
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'x-api-key': '0ef1e68d55ec041cfa7bc9695b585515de7234681c01aff5a19e1e4a170787d5'
        },
        data: JSON.stringify(data),
        success: function (response) {
            if (response.status === true) {
                // console.log('Stock updated successfully');
            } else {
                // console.log('Error updating stock:', response.message);
            }
        },
        error: function (err) {
            // console.log('AJAX error:', err);
            // alert("error")
        }
    });
}