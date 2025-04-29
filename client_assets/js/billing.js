// dashboard.js

function getDbUserFromLocalStorage() {
  const dbUserJSON = localStorage.getItem('dbUser');
  if (dbUserJSON) {
    return JSON.parse(dbUserJSON);
  } else {
    return null;
  }
}

function createUserName(dbUser) {
  if (dbUser && dbUser.first_name && dbUser.last_name) {
    return `${dbUser.first_name} ${dbUser.last_name}`;
  } else {
    return 'User';
  }
}

function onPageLoad() {
  const dbUser = getDbUserFromLocalStorage();

  if (dbUser) {
    //console.log('User data retrieved:', dbUser);
    const userNameElement = document.getElementById('userName');
    document.getElementById('cid').textContent = dbUser.cid;
    document.getElementById('first_name').textContent = dbUser.first_name;
    document.getElementById('last_name').textContent = dbUser.last_name;
    document.getElementById('email').textContent = dbUser.email;
    document.getElementById('phoneno').textContent = dbUser.phoneno;
    document.getElementById('account').textContent = formattedAccount;
    // document.getElementById('ifsc').textContent = dbUser.ifsc;
    // document.getElementById('panid').textContent = dbUser.panid;
    document.getElementById('address').textContent = dbUser.address;
    document.getElementById('seller_name').textContent = dbUser.seller_name;
    document.getElementById('shop_name').textContent = dbUser.shop_name;

    if (userNameElement) {
      const userName = createUserName(dbUser);
      userNameElement.textContent = userName;
    }

  } else {
    window.location.href = 'sign-in.html';
    // console.log('No user found');
  }
}

// Call onPageLoad function when the page is loaded
onPageLoad()
// billing.js
const form = document.getElementById("product_code_searchbar");
const input = document.getElementById("product_code_input");
const products_section = document.getElementById("products_section");
const items_section = document.getElementById("items_section");

let checkoutProducts = [];

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let product_codes = input.value?.trim();

  if (product_codes === "") {
    return;
  }

  product_codes = product_codes.split(",").map((code) => code.trim());

  fetch(`https://minitzgo.com/api/fetch_products.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "2637338988c5f3bbf8d4934dc458b966a21a1d2d56931390f97ce7c4641a2677",
    },
    body: JSON.stringify({ cid: dbUser.cid }), // Fixed: Added JSON.stringify
  })
    .then((response) => response.json())
    .then((data) => {
      const filteredProducts = data.data.filter((product) => {
        return product_codes.includes(product.pcode);
      });
      displayProducts(filteredProducts);
    })
    // .catch((error) => console.error("Error:", error));
});

function onAddToCheckout(productId) {
  fetch(`https://minitzgo.com/api/fetch_products.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "2637338988c5f3bbf8d4934dc458b966a21a1d2d56931390f97ce7c4641a2677",
    },
    body: JSON.stringify({ cid: cid }), // Fixed: Added JSON.stringify
  })
    .then((response) => response.json())
    .then((data) => {
      const products = data.data;
      const productToAdd = products.find(
        (product) => product.pid === productId
      );
      if (productToAdd) {
        const existingProductIndex = checkoutProducts.findIndex(
          (product) => product.pid === productId
        );
        if (existingProductIndex !== -1) {
          checkoutProducts[existingProductIndex].quantity++;
        } else {
          productToAdd.quantity = 1;
          checkoutProducts.push(productToAdd);
        }
        // console.log("CHECKOUT PRODUCTS", checkoutProducts);
        updateCheckoutProductCount();
      } else {
        // console.log("Product not found");
      }
    })
    // .catch((error) => console.error("Error:", error));
}

function updateCheckoutProductCount() {
  const totalQuantity = checkoutProducts.reduce(
    (total, product) => total + product.quantity,
    0
  );

  items_section.innerHTML = `
    <span>Items Added ${totalQuantity}</span>
    <button
      class="btn btn-primary my-auto"
      data-bs-toggle="modal"
      data-bs-target="#billingModal"
    >
      Send bill
    </button>
  `;
}

const quantityInput = document.getElementById("quantity");

function updateQuantityField() {
  if (quantityInput) {
    const totalQuantity = checkoutProducts.reduce(
      (total, product) => total + product.quantity,
      0
    );
    quantityInput.value = totalQuantity;
  }
}
function displayCheckoutProducts() {
  const productCardsContainer = document.getElementById("productCards");
  productCardsContainer.innerHTML = "";

  checkoutProducts.forEach((product) => {
    const productCard = document.createElement("tr");



    productCard.innerHTML = `
     <td>
        <img src="${product.product_image1}" alt="Product Image" class="img-fluid rounded" style="width: 80px; height: 80px;">
      </td>
      <td>${product.category}</td>
      <td>${product.product_title}</td>
      <td>₹${product.product_price}</td>
      <td>
        <div class="d-flex align-items-center">
          <button class="btn btn-light border rounded px-2" onclick="decreaseQuantity('${product.pid}')">-</button>
          <span class="mx-2">${product.quantity}</span>
          <button class="btn btn-light border rounded px-2" onclick="increaseQuantity('${product.pid}')">+</button>
        </div>
      </td>
      <td>₹${(product.product_price * product.quantity).toFixed(2)}</td>
      <td>
        <button class="btn btn-danger px-3" onclick="removeFromCheckout('${product.pid}')">Delete</button>
      </td>
    `;

    productCardsContainer.appendChild(productCard);
  });
  // console.log("billing,js file")
}

function increaseQuantity(productId) {
  const productIndex = checkoutProducts.findIndex(
    (product) => product.pid === productId
  );
  if (productIndex !== -1) {
    checkoutProducts[productIndex].quantity++;
    updateCheckoutProductCount();
    updateQuantityField();
    displayCheckoutProducts();
  }
}

function decreaseQuantity(productId) {
  const productIndex = checkoutProducts.findIndex(
    (product) => product.pid === productId
  );
  if (productIndex !== -1) {
    if (checkoutProducts[productIndex].quantity > 1) {
      checkoutProducts[productIndex].quantity--;
      updateCheckoutProductCount();
      updateQuantityField();
      displayCheckoutProducts();
    }
  }
}

function removeFromCheckout(productId) {
  const productIndex = checkoutProducts.findIndex(
    (product) => product.pid === productId
  );
  if (productIndex !== -1) {
    checkoutProducts.splice(productIndex, 1);
    updateCheckoutProductCount();
    updateQuantityField();
    displayCheckoutProducts();
  }
}






// Send confiremed bill code starts here

function sendConfirmedBill() {
  const fullName = document.getElementById("full_name").value;
  const whatsAppNumber = document.getElementById("whatsapp_number").value;

  const productsToSend = checkoutProducts.map(product => {
    const totalAmount = product.quantity * product.product_price;
    return {
      pid: product.pid,
      pcode: product.pcode,
      product_title: product.product_title,
      product_color1: product.product_color1,
      quantity: product.quantity,
      totalAmount: totalAmount,
      size: product.product_size
    };
  });

  const confirmedBill = {
    fullName: fullName,
    whatsAppNumber: whatsAppNumber,
    products: productsToSend
  };

  // console.log("CONFIREMD BILL DETAILS:", confirmedBill);
}

// Event listener for Send Confirmed Bill button
document.getElementById("sendConfirmedBillBtn").addEventListener("click", sendConfirmedBill);

// Send confirmed bill code ends here





// Event listener to execute the function when the modal is shown
document
  .getElementById("billingModal")
  .addEventListener("shown.bs.modal", function () {
    updateQuantityField();
    displayCheckoutProducts();
  });

function displayProducts(products) {
  products_section.innerHTML = "";
  let products_html = "";

  products.forEach((product) => {
    products_html += "<div class='col-xl-3 col-md-6 mb-xl-0 mb-4 my-2'>";
    products_html +=
      "<div class='card card-blog card-plain rounded rounded-2 shadow shadow-2 p-3'>";
    products_html += "<div class='position-relative'>";
    products_html +=
      "<a class='d-block border border-radius-xl d-flex justify-content-center  mx-1'>";
    products_html +=
      "<img src='" +
      product.product_image1 +
      "' alt='img-blur-shadow' class='img-fluid fixed-size-image border-radius-xl p-1'>";
    products_html += "</a>";
    products_html += "</div>";
    products_html += "<div class='card-body px-1 pb-0'>";
    products_html +=
      "<p class='text-gradient text-dark mb-2 text-sm'>" +
      product.category +
      "</p>";
    products_html += "<a href='javascript:;'>";
    products_html += "<h5> Tittle:" + product.product_title + "</h5>";
    products_html += "<h6 class='text-sm'> Pcode:" + product.pcode + "</h6>";
    products_html += "</a>";
    products_html += "<h5> Price:" + product.product_price + "₹</h5>";
    products_html +=
      "<p class='mb-4 text-sm'> Description: " + product.product_discription + "</p>";
    products_html +=
      "<div class='d-flex align-items-center justify-content-between'>";
    // products_html +="<button type='button' class='btn btn-outline-primary btn-sm mb-0'>Edit</button>";
    products_html +=
      "<button type='button' class='btn btn-primary btn-sm mb-0' onclick='onAddToCheckout(\"" +
      product.pid +
      "\")'>Add to Checkout</button>";
    products_html += "</div>";
    products_html += "</div>";
    products_html += "</div>";
    products_html += "</div>";
  });

  products_section.innerHTML = products_html;
}

function onEdit() {
  return;
}



document.addEventListener('DOMContentLoaded', function () {
  const dbUser = JSON.parse(localStorage.getItem('dbUser'));
  let cid = null;

  if (dbUser && dbUser.cid) {
    cid = dbUser.cid;
    // console.log('CID from dbUser:', cid); // Debugging log
  } else {
    // console.error('CID not found in dbUser.');
    const billsList = document.getElementById('bills-list');
    if (billsList) {
      billsList.innerHTML = `
        <li class="list-group-item text-danger">
          Error: CID not found in local storage. Please log in again.
        </li>
      `;
    }
    return; // Stop further execution if cid is not found
  }

  // Fetch bills if CID is available
  fetch('https://minitzgo.com/api/bills_fetch.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': '6cbb787e9782df66c3c8f4540003c30d36494b462fbf0d27c838f6243711cc24'
    },
    body: JSON.stringify({ cid }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(apiResponse => {
      // console.log('API Response:', apiResponse); // Debugging log

      const billsList = document.getElementById('bills-list');
      if (!apiResponse.status || !apiResponse.data) {
        throw new Error(apiResponse.message || 'Invalid data format.');
      }

      billsList.innerHTML = ''; // Clear any existing content

      // Sort bills by id in descending order and take the top 5
      const recentBills = apiResponse.data
        .sort((a, b) => b.id - a.id)  // Sort by id (highest first)
        .slice(0, 5);  // Take the first 5 items

      recentBills.forEach(bill => {
        const filepath = bill.filepath ? bill.filepath.trim() : '#';  // Ensure filepath is not empty
        const listItem = document.createElement('li');
        listItem.classList.add(
          'list-group-item',
          'border-0',
          'd-flex',
          'justify-content-between',
          'ps-0',
          'mb-2',
          'border-radius-lg'
        );

        const leftContent = document.createElement('div');
        leftContent.classList.add('d-flex', 'flex-column');
        leftContent.innerHTML = `
          <h6 class="mb-1 text-dark font-weight-bold text-sm">
            ${new Date(bill.timestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        })}
          </h6>
          <span class="text-xs">#${bill.id}</span>
        `;

        const rightContent = document.createElement('div');
        rightContent.classList.add('d-flex', 'align-items-center', 'text-sm');

        const viewButton = document.createElement('a');
        viewButton.href = filepath;
        viewButton.target = '_blank';  // Open in new tab
        viewButton.rel = 'noopener noreferrer';  // Security best practice
        viewButton.classList.add('btn', 'btn-link', 'text-dark', 'text-sm', 'mb-0', 'px-0', 'ms-4');
        viewButton.innerHTML = `<i class="fas fa-file-pdf text-lg me-1"></i> View/Download`;
        viewButton.download = `bill_${bill.id}.pdf`;  // Add download attribute to trigger download

        rightContent.appendChild(viewButton);
        listItem.appendChild(leftContent);
        listItem.appendChild(rightContent);

        billsList.appendChild(listItem);
      });

    })
    .catch(error => {
      // console.error('Error fetching bills:', error);

      const billsList = document.getElementById('bills-list');
      if (billsList) {
        billsList.innerHTML = `
          <li class="list-group-item text-danger">
            Error fetching bills: ${error.message}
          </li>
        `;
      }
    });
});


// Retrieve and parse the data from localStorage
const dbUser = JSON.parse(localStorage.getItem('dbUser'));

if (dbUser) {
  // Format account number with spaces every four digits
  const formattedAccount = dbUser.account.replace(/(\d{4})(?=\d)/g, '$1 ');

  // Assign each value to the corresponding element by id
  document.getElementById('cid').textContent = dbUser.cid;
  document.getElementById('first_name').textContent = dbUser.first_name;
  document.getElementById('last_name').textContent = dbUser.last_name;
  document.getElementById('email').textContent = dbUser.email;
  document.getElementById('phoneno').textContent = dbUser.phoneno;
  document.getElementById('account').textContent = formattedAccount;
  document.getElementById('ifsc').textContent = dbUser.ifsc;
  document.getElementById('panid').textContent = dbUser.panid;
  document.getElementById('address').textContent = dbUser.address;
  document.getElementById('seller_name').textContent = dbUser.seller_name;
  document.getElementById('shop_name').textContent = dbUser.shop_name;
} else {
  // Display a message if no data is found
  document.body.innerHTML = '<p>No user data found in local storage.</p>';
}



var win = navigator.platform.indexOf("Win") > -1;
if (win && document.querySelector("#sidenav-scrollbar")) {
  var options = {
    damping: "0.5",
  };
  Scrollbar.init(document.querySelector("#sidenav-scrollbar"), options);
}

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve cid from local storage
  let cid = dbUser.cid
  // console.log("CID retrieved from localStorage:", cid);

  if (cid) {
    // Define the API endpoint
    const apiUrl = 'https://minitzgo.com/api/client_bill_info.php';

    // Prepare the POST request payload
    const payload = { cid: cid };

    // Fetch client billing information
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': '3abc7c11200bd81aa9e4d519ef14e038310fa4907205d99aaff59c622b248a78'
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        // console.log("API Response Data:", data); // Log the API response

        if (data.status === false) {
          // Handle the error case where no data is found
          // console.error(data.message);
          alert(data.message); // Show the error message to the user
        } else {
          // Populate the fields with response data
          document.getElementById("shop_name").innerText = data.shop_name || "Fashion Shop Name";
          document.getElementById("shop_address").innerText = data.address || "Address Line 1, Address Line 2, City, State, Postal Code";
          document.getElementById("shop_contact").innerText = `Contact: ${data.phoneno} | Email: ${data.email}`;
          document.getElementById("shop_gst").innerText = `GSTIN: ${data.gst}`;
          document.getElementById("customer_name").innerText = `${data.first_name} ${data.last_name}`;
          document.getElementById("customer_phone").innerText = data.phoneno;
          document.getElementById("customer_email").innerText = data.email;
          document.getElementById("customer_address").innerText = data.address;

        }
      })
      .catch(error => {
        // console.error("Error fetching data:", error);
      });
  } else {
    // console.error("CID not found in local storage.");
  }
});




// Declare the phone number as a global variable
let phone = "";

function updatePreview() {
  const name = document.getElementById("name").value;

  // Update the global variable
  phone = document.getElementById("phone").value;

  document.getElementById("namePreview").textContent = name;
  document.getElementById("phonePreview").textContent = phone;
}






let billNumber;
function fetchBillNumber() {
  fetch('http://localhost/client/pages/bill_num.php')
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        billNumber = data.bill_number;

        document.getElementById("bill_number").innerText = billNumber; // Display the bill number on the page
      } else {
        // console.error("Error:", data.message);
      }
    })
    .catch(error => {
      // console.error("Fetch error:", error);
    });
}

// Call this function wherever you need to generate and display the bill number
fetchBillNumber();







//stock update by ajax

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("product_code_input").addEventListener("change", async function () {
    const enteredCode = this.value.trim();
    const quantityInput = parseInt(document.getElementById("quantity_input").value.trim());

    if (!enteredCode || isNaN(quantityInput)) {
      document.getElementById("currentstock").innerHTML = "Please enter a valid product code and quantity.";
      return;
    }

    // try {
      console.log("Fetching current stock for product code:", enteredCode);


    //   // Fetch product details
    //   const response = await fetch("https://minitzgo.com/api/fetch_products.php", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "x-api-key": "2637338988c5f3bbf8d4934dc458b966a21a1d2d56931390f97ce7c4641a2677"
    //     },
    //     body: {
    //       'cid': cid
    //     }
    //   });

    //   if (!response.ok) throw new Error(`Error fetching product data: ${response.statusText}`);

    //   const data = await response.json();
      console.log("Product Data Response:", data);

    //   let output = "Product not found.";
    //   if (data.data && data.data.length > 0) {
    //     const matchingProduct = data.data.find(product => product.pcode === enteredCode);

    //     if (matchingProduct) {
    //       const currentStock = parseInt(matchingProduct.product_stock);
          console.log("Current Stock for", enteredCode, ":", currentStock);

    //       if (quantityInput > currentStock) {
    //         output = "Insufficient stock available.";
    //       } else {
    //         const updatedStock = currentStock - quantityInput;
            console.log("Updated Stock:", updatedStock);

    //         // Update the stock using stockupdatepcode API
    //         const updateResponse = await fetch("https://minitzgo.com/api/stockupdatepcode.php", {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/json",
    //             "xapikey": "be0fbece0783dc6732b25d5fee7886b9",
    //           },
    //           body: JSON.stringify({
    //             pcode: enteredCode,
    //             stock: updatedStock,
    //           }),
    //         });

    //         if (!updateResponse.ok) throw new Error(`Error updating stock: ${updateResponse.statusText}`);

    //         const updateData = await updateResponse.json();
            console.log("Stock Update Response:", updateData);

    //         if (updateData.status) {
    //           output = `Stock updated successfully. New stock: ${updatedStock}`;
    //         } else {
    //           output = "Failed to update stock.";
    //         }
    //       }
    //     }
    //   }

    //   document.getElementById("currentstock").innerHTML = output;
    // } catch (error) {
    //   document.getElementById("currentstock").innerHTML = "Network error or failed request.";
      console.error("Error:", error);
    // }
    try {
      // console.log("Fetching current stock for product code:", enteredCode);

      // Validate quantityInput (must be positive integer)
      const quantity = parseInt(quantityInput);
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error("Invalid quantity. Must be a positive number.");
      }

      // Fetch product details
      const response = await fetch("https://minitzgo.com/api/fetch_products.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "2637338988c5f3bbf8d4934dc458b966a21a1d2d56931390f97ce7c4641a2677",
        },
        body: JSON.stringify({ cid: cid }), // Fixed: Added JSON.stringify
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // console.log("Product Data Response:", data);

      let output = "Product not found.";
      if (data.data && data.data.length > 0) {
        const matchingProduct = data.data.find((product) => product.pcode === enteredCode);

        if (!matchingProduct) {
          output = "Product not found.";
        } else {
          const currentStock = parseInt(matchingProduct.product_stock);
          // console.log("Current Stock for", enteredCode, ":", currentStock);

          if (quantity > currentStock) {
            output = `Insufficient stock. Available: ${currentStock}`;
          } else {
            const updatedStock = currentStock - quantity;

            // Update stock via API
            const updateResponse = await fetch("https://minitzgo.com/api/stockupdatepcode.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": "05e335df012afa910ea6f8f02908348a715a4f0b4a2db92e113ae9b763719a1a", // Fixed: Consistent header name
              },
              body: JSON.stringify({
                pcode: enteredCode,
                stock: updatedStock,
              }),
            });

            if (!updateResponse.ok) {
              throw new Error(`Stock update failed: ${updateResponse.statusText}`);
            }

            const updateData = await updateResponse.json();
            // console.log("Stock Update Response:", updateData);

            if (updateData.status) {
              output = `Stock updated successfully. Remaining: ${updatedStock}`;
            } else {
              // Rollback logic (optional): Revert stock deduction if update fails
              output = "Failed to update stock. Please retry.";
            }
          }
        }
      }

      document.getElementById("currentstock").textContent = output;
    } catch (error) {
      // console.error("Error:", error);
      document.getElementById("currentstock").textContent =
        error.message || "Network error. Please try again.";
    }
  });
});






document.getElementById("sendConfirmedBillBtn").addEventListener("click", function () {
  const dbUser = JSON.parse(localStorage.getItem("dbUser"));
  let cid = dbUser && dbUser.cid ? dbUser.cid : null;

  if (!cid) {
    // console.error("CID not found. Please log in again.");
    alert("Error: CID not found. Please log in again.");
    return;
  }

  const content = document.getElementById("bill-content");
  if (!content) {
    // console.error("Bill content not found.");
    alert("Error: Bill content not found.");
    return;
  }

  // Keep the original bill number generation code here
  const billNumber = generateBillNumber();

  html2pdf()
    .from(content)
    .toPdf()
    .outputPdf("datauristring")
    .then(function (pdfDataUri) {
      const pdfBlob = dataURItoBlob(pdfDataUri);
      const formData = new FormData();
      const pdfName = `${billNumber}.pdf`;
      formData.append("pdf", pdfBlob, pdfName);

      fetch("upload_bill.php", {
        method: "POST",
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (data.filePath) {
            // console.log("File Path:", data.filePath);
            sendFilePathToAPI(data.filePath, cid);
            openWhatsApp(data.filePath, dbUser.phone || phone);
          } else {
            // console.error("File path not found in server response.");

          }
        })
        .catch(err => {
          // console.error("Error uploading the file:", err);
          alert("Error: Failed to upload the file. Please try again.");
        });
    });

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  function sendFilePathToAPI(filepath, cid) {
    // console.log("Sending file path to API with CID:", cid);
    fetch("https://minitzgo.com/api/bills.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'X-API-Key': 'd69655cc30f6795e823703cf60dfe4f054e9bd4cea94e22e76309dda8e78eb16'
      },
      body: JSON.stringify({
        filepath: filepath,
        cid: cid,
      }),
    })
      .then(response => response.json())
      .then(data => {
        // console.log("API Response:", data);
        if (data.status === "success") {

        } else {
          // console.error("API Error:", data);

        }
      })
      .catch(error => {
        // console.error("Error sending file path to API:", error);

      });
  }

  function openWhatsApp(filePath, phoneNumber) {
    const message = `Hi, here is your bill from clientNAme (minitzgo): ${filePath}`;
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  }

  function generateBillNumber() {
    const prefix = "BILL"; // Keep your original logic here if it was different
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomPart}`;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const dateElement = document.getElementById("current-date");
  if (dateElement) {
    dateElement.innerText = getCurrentDate();
  } else {
    // console.error("Element with id 'current-date' not found.");
  }
});





//stock update by ajax

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("product_code_input").addEventListener("change", async function () {
    const enteredCode = this.value.trim();
    const quantityInput = parseInt(document.getElementById("quantity_input").value.trim());

    if (!enteredCode || isNaN(quantityInput)) {
      document.getElementById("currentstock").innerHTML = "Please enter a valid product code and quantity.";
      return;
    }

    // try {
      console.log("Fetching current stock for product code:", enteredCode);


    //   // Fetch product details
    //   const response = await fetch("https://minitzgo.com/api/fetch_products.php", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "x-api-key": "2637338988c5f3bbf8d4934dc458b966a21a1d2d56931390f97ce7c4641a2677"
    //     },
    //     body: {
    //       'cid': cid
    //     }
    //   });

    //   if (!response.ok) throw new Error(`Error fetching product data: ${response.statusText}`);

    //   const data = await response.json();
      console.log("Product Data Response:", data);

    //   let output = "Product not found.";
    //   if (data.data && data.data.length > 0) {
    //     const matchingProduct = data.data.find(product => product.pcode === enteredCode);

    //     if (matchingProduct) {
    //       const currentStock = parseInt(matchingProduct.product_stock);
          console.log("Current Stock for", enteredCode, ":", currentStock);

    //       if (quantityInput > currentStock) {
    //         output = "Insufficient stock available.";
    //       } else {
    //         const updatedStock = currentStock - quantityInput;
            console.log("Updated Stock:", updatedStock);

    //         // Update the stock using stockupdatepcode API
    //         const updateResponse = await fetch("https://minitzgo.com/api/stockupdatepcode.php", {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/json",
    //             "xapikey": "be0fbece0783dc6732b25d5fee7886b9",
    //           },
    //           body: JSON.stringify({
    //             pcode: enteredCode,
    //             stock: updatedStock,
    //           }),
    //         });

    //         if (!updateResponse.ok) throw new Error(`Error updating stock: ${updateResponse.statusText}`);

    //         const updateData = await updateResponse.json();
            console.log("Stock Update Response:", updateData);

    //         if (updateData.status) {
    //           output = `Stock updated successfully. New stock: ${updatedStock}`;
    //         } else {
    //           output = "Failed to update stock.";
    //         }
    //       }
    //     }
    //   }

    //   document.getElementById("currentstock").innerHTML = output;
    // } catch (error) {
    //   document.getElementById("currentstock").innerHTML = "Network error or failed request.";
      console.error("Error:", error);
    // }
    try {
      // console.log("Fetching current stock for product code:", enteredCode);

      // Validate quantityInput (must be positive integer)
      const quantity = parseInt(quantityInput);
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error("Invalid quantity. Must be a positive number.");
      }

      // Fetch product details
      const response = await fetch("https://minitzgo.com/api/fetch_products.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "2637338988c5f3bbf8d4934dc458b966a21a1d2d56931390f97ce7c4641a2677",
        },
        body: JSON.stringify({ cid: cid }), // Fixed: Added JSON.stringify
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // console.log("Product Data Response:", data);

      let output = "Product not found.";
      if (data.data && data.data.length > 0) {
        const matchingProduct = data.data.find((product) => product.pcode === enteredCode);

        if (!matchingProduct) {
          output = "Product not found.";
        } else {
          const currentStock = parseInt(matchingProduct.product_stock);
          // console.log("Current Stock for", enteredCode, ":", currentStock);

          if (quantity > currentStock) {
            output = `Insufficient stock. Available: ${currentStock}`;
          } else {
            const updatedStock = currentStock - quantity;

            // Update stock via API
            const updateResponse = await fetch("https://minitzgo.com/api/stockupdatepcode.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": "05e335df012afa910ea6f8f02908348a715a4f0b4a2db92e113ae9b763719a1a", // Fixed: Consistent header name
              },
              body: JSON.stringify({
                pcode: enteredCode,
                stock: updatedStock,
              }),
            });

            if (!updateResponse.ok) {
              throw new Error(`Stock update failed: ${updateResponse.statusText}`);
            }

            const updateData = await updateResponse.json();
            // console.log("Stock Update Response:", updateData);

            if (updateData.status) {
              output = `Stock updated successfully. Remaining: ${updatedStock}`;
            } else {
              // Rollback logic (optional): Revert stock deduction if update fails
              output = "Failed to update stock. Please retry.";
            }
          }
        }
      }

      document.getElementById("currentstock").textContent = output;
    } catch (error) {
      // console.error("Error:", error);
      document.getElementById("currentstock").textContent =
        error.message || "Network error. Please try again.";
    }
  });
});