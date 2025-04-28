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
    console.log('User data retrieved:', dbUser);
    const userNameElement = document.getElementById('userName');

    if (userNameElement) {
      const userName = createUserName(dbUser);
      userNameElement.textContent = userName;
    }

  } else {
    window.location.href = 'sign-in.html';
    console.log('No user found');
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
    .catch((error) => console.error("Error:", error));
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
        console.log("CHECKOUT PRODUCTS", checkoutProducts);
        updateCheckoutProductCount();
      } else {
        console.log("Product not found");
      }
    })
    .catch((error) => console.error("Error:", error));
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
  console.log("billing,js file")
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

  console.log("CONFIREMD BILL DETAILS:", confirmedBill);
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
