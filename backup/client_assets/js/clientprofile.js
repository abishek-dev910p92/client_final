function onPageLoad() {
    const dbUser = getDbUserFromLocalStorage();

    if (dbUser) {
        const userNameElement = document.getElementById('userName');
        const clientName=document.getElementById('clientName');
        const storeName=document.getElementById('storeName');
        const clientAddress=document.getElementById('clientAddress');
        const clientDescription=document.getElementById('clientDescription');
        const fullName=document.getElementById('fullName');
        const phoneNo=document.getElementById('phoneNo');
        const clientEmail=document.getElementById('clientEmail');
        
        const cidDisplay = document.getElementById('cidDisplay');
        const firstNameDisplay = document.getElementById('firstNameDisplay');
        const lastNameDisplay = document.getElementById('lastNameDisplay');
        const emailDisplay = document.getElementById('emailDisplay');
        const phoneNoDisplay = document.getElementById('phoneNoDisplay');
        const accountDisplay = document.getElementById('accountDisplay');
        const ifscDisplay = document.getElementById('ifscDisplay');
        const upiDisplay = document.getElementById('upiDisplay');
        const panidDisplay = document.getElementById('panidDisplay');
        const addressDisplay = document.getElementById('addressDisplay');
        const shopNameDisplay = document.getElementById('shopNameDisplay');
        const sellerNameDisplay = document.getElementById('sellerNameDisplay');
        const clientTotalOrdersDisplay = document.getElementById('clientTotalOrdersDisplay');
        const coordinatesDisplay = document.getElementById('coordinatesDisplay');
        
        // Update profile fields with user data
        cidDisplay.textContent = dbUser.cid;
        firstNameDisplay.textContent = dbUser.first_name;
        lastNameDisplay.textContent = dbUser.last_name;
        emailDisplay.textContent = dbUser.email;
        phoneNoDisplay.textContent = dbUser.phoneno;
        accountDisplay.textContent = dbUser.account;
        ifscDisplay.textContent = dbUser.ifsc;
        upiDisplay.textContent = dbUser.upi;
        panidDisplay.textContent = dbUser.panid;
        addressDisplay.textContent = dbUser.address;
        shopNameDisplay.textContent = dbUser.shop_name;
        sellerNameDisplay.textContent = dbUser.seller_name;
        clientTotalOrdersDisplay.textContent = dbUser.client_total_orders;

        // Coordinates link (set Google Maps link)
        const coordinatesURL = dbUser.coordinates;  // Example: "https://www.google.com/maps?q=17.37624575,78.50242899999999"
        coordinatesDisplay.href = coordinatesURL;  // Set the Google Maps link
        coordinatesDisplay.textContent = "View on Google Maps";  // Display text for the button
    } else {
        window.location.href = 'sign-in.html';
        console.log('No user found');
    }
}

onPageLoad();
