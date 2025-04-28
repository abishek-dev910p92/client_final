 // Retrieve and parse the data from localStorage
 const dbUser = JSON.parse(localStorage.getItem('dbUser'));
    
 if (dbUser) {
     // Build HTML to display user data
     let userInfoHtml = `
         <p><strong>CID:</strong> ${dbUser.cid}</p>
         <p><strong>First Name:</strong> ${dbUser.first_name}</p>
         <p><strong>Last Name:</strong> ${dbUser.last_name}</p>
         <p><strong>Email:</strong> ${dbUser.email}</p>
         <p><strong>Phone Number:</strong> ${dbUser.phoneno}</p>
         <p><strong>Account Number:</strong> ${dbUser.account}</p>
         <p><strong>IFSC Code:</strong> ${dbUser.ifsc}</p>
         <p><strong>Pan ID:</strong> ${dbUser.panid}</p>
         <p><strong>Address:</strong> ${dbUser.address}</p>
         <p><strong>Seller Name:</strong> ${dbUser.seller_name}</p>
         <p><strong>Shop Name:</strong> ${dbUser.shop_name}</p>
     `;

     // Inject HTML into the page
     document.getElementById('userData').innerHTML = userInfoHtml;
 } else {
     // If data is not found, display a message
     document.getElementById('userData').innerHTML = '<p>No user data found in local storage.</p>';
 }