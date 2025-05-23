// // dashboard.js





// document.addEventListener('DOMContentLoaded', function () {

//     function getDbUserFromLocalStorage() {
//         const dbUserJSON = localStorage.getItem('dbUser');
//         if (dbUserJSON) {
//             return JSON.parse(dbUserJSON);
//         } else {
//             return null;
//         }
//     }

//     function createUserName(dbUser) {
//         if (dbUser && dbUser.first_name && dbUser.last_name) {
//             return `${dbUser.first_name} ${dbUser.last_name}`;
//         } else {
//             return 'User';
//         }
//     }

//     function onPageLoad() {
//         const dbUser = getDbUserFromLocalStorage();

//         if (dbUser) {
//             const userNameElement = document.getElementById('userName');

//             if (userNameElement) {
//                 const userName = createUserName(dbUser);
//                 userNameElement.textContent = userName;
//             }

//         } else {
//             window.location.href = 'sign-in.html';
//             console.log('No user found');
//         }
//     }



//     // Call onPageLoad function when the page is loaded
//     onPageLoad()
//     const dbUser = JSON.parse(localStorage.getItem('dbUser'));
//     const cid = dbUser ? dbUser.cid : null;
//     const requestBody = JSON.stringify({ cid });

//     const fullName = dbUser ? `${dbUser.first_name} ${dbUser.last_name}` : '';
//     const fullNameElement = document.getElementById('fullName');
//     fullNameElement.textContent = `Hello, ${fullName} !!`;





//     // Total Products- starts here
//     const apiKey_totalprod ='a0c75839fca1668ac6cf45e464a22f4a16f4d2dcbc1e2a5aea4948df42e688ea';
//     function fetchProductCount() {

//       fetch('https://minitzgo.com/api/total_products.php', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-API-Key': apiKey_totalprod
//       },
//         body: requestBody
//       })
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then(data => {
//           console.log("DATA", data);
//           const totalproducts= data.count;
//           console.log("TOTAL products:", totalproducts);

//           const totalOrdersElement = document.getElementById('totalProductsCount');
//           totalOrdersElement.textContent = totalproducts;
//         })
//         .catch(error => {
//           console.error('Error updating total orders:', error);
//           const totalOrdersElement = document.getElementById('totalProductsCount');
//           totalOrdersElement.textContent = 'Error fetching total orders'; 
//         });
//     }
//     fetchProductCount();

//     // Total Products- ends here








//     // Total Orders - starts here
//     const apiKey_totalorders = '507ba0c2db06231a1a2ce2524f3e12b57d3bc6c0e9d47c5752f5fb9b8f87a3e8';
//     function updateTotalOrders() {


//       fetch('https://minitzgo.com/api/total_orders.php', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-API-Key': apiKey_totalorders 
//       },
//         body: requestBody
//       })
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then(data => {
//           console.log("DATA", data);
//           const totalOrders = data.count;
//           console.log("TOTAL ORDERS:", totalOrders);

//           const totalOrdersElement = document.getElementById('total_orders');
//           totalOrdersElement.textContent = totalOrders;
//         })
//         .catch(error => {
//           console.error('Error updating total orders:', error);
//           const totalOrdersElement = document.getElementById('total_orders');
//           totalOrdersElement.textContent = 'Error fetching total orders'; 
//         });
//     }
//     updateTotalOrders();


//     // Total Orders - ends here

//     // Total Sales - starts here


//     function updateTotalSale() {


//       fetch('https://minitgo.com/api/total_sale.php', {
//         method: 'POST',
//         body: requestBody,
//         headers: {
//         }
//       })
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json(); // Parse response body as JSON
//         })
//         .then(data => {
//           console.log("DATA", data);
//           const totalSales = data.total_amount; // Access total_amount from parsed JSON data
//           console.log("TOTAL SALES:", totalSales);
//           const totalSalesWithRupee = `₹ ${totalSales}`;

//           const totalSalesElement = document.getElementById('total_sale');
//           totalSalesElement.textContent = totalSalesWithRupee;
//         })
//         .catch(error => {
//           console.error('Error updating total sales:', error);
//           const totalSalesElement = document.getElementById('total_sale');
//           totalSalesElement.textContent = 'Error fetching total sales';
//         });
//     }

//     updateTotalSale();

//     // Total Sales - ends here


//     // Todays Orders- starts here 
// const apiKey = 'be0fbece0783dc6732b25d5fee7886b9';
//     function updateTodaysOrders(){
//         fetch('https://minitgo.com/api/todays_orders.php', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'X-API-Key': apiKey 
//           },
//             body: requestBody
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log("TODAYS:",data)
//             document.getElementById('todays_orders').textContent = data.count;
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });

//     }

//     updateTodaysOrders()


//     // Todays Orders-ends here

//   });


document.addEventListener('DOMContentLoaded', function () {

  function getDbUserFromLocalStorage() {
    const dbUserJSON = localStorage.getItem('dbUser');
    return dbUserJSON ? JSON.parse(dbUserJSON) : null;
  }

  function createUserName(dbUser) {
    return dbUser && dbUser.first_name && dbUser.last_name
      ? `${dbUser.first_name} ${dbUser.last_name}`
      : 'User';
  }

  function onPageLoad() {
    const dbUser = getDbUserFromLocalStorage();
    if (dbUser) {
      const userNameElement = document.getElementById('userName');
      if (userNameElement) {
        userNameElement.textContent = createUserName(dbUser);
      }
    } else {
      window.location.href = 'sign-in.html';
      console.log('No user found');
    }
  }

  onPageLoad();

  const dbUser = JSON.parse(localStorage.getItem('dbUser'));
  const cid = dbUser ? dbUser.cid : null;
  const requestBody = JSON.stringify({ cid });

  const fullName = dbUser ? `${dbUser.first_name} ${dbUser.last_name}` : '';
  document.getElementById('fullName').textContent = `Hello, ${fullName} !!`;

  const apiKey_totalprod = 'a0c75839fca1668ac6cf45e464a22f4a16f4d2dcbc1e2a5aea4948df42e688ea';
  function fetchProductCount() {
    fetch('https://minitzgo.com/api/total_products.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey_totalprod },
      body: requestBody
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('totalProductsCount').textContent = data.count;
      })
      .catch(() => {
        document.getElementById('totalProductsCount').textContent = 'Error fetching total products';
      });
  }

  const apiKey_totalorders = '507ba0c2db06231a1a2ce2524f3e12b57d3bc6c0e9d47c5752f5fb9b8f87a3e8';
  function updateTotalOrders() {
    fetch('https://minitzgo.com/api/total_orders.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey_totalorders },
      body: requestBody
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('total_orders').textContent = data.count;
      })
      .catch(() => {
        document.getElementById('total_orders').textContent = 'Error fetching total orders';
      });
  }

  const apikey_totalsale = '7620f8aea22da44c728c8bd48a87707d4da3d6eef5b271d1d99231b1ef5c4c04';
  function updateTotalSale() {


    fetch('https://www.minitzgo.com/api/total_sale.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apikey_totalsale
      },
      body: requestBody
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse response body as JSON
      })
      .then(data => {
        console.log("DATA", data);
        const totalSales = data.total_amount; // Access total_amount from parsed JSON data
        console.log("TOTAL SALES:", totalSales);
        const totalSalesWithRupee = `₹ ${totalSales}`;

        const totalSalesElement = document.getElementById('total_sale');
        totalSalesElement.textContent = totalSalesWithRupee;
      })
      .catch(error => {
        console.error('Error updating total sales:', error);
        const totalSalesElement = document.getElementById('total_sale');
        totalSalesElement.textContent = 'Error fetching total sales';
      });
  }

  const apiKey_todaysOrders = '0205ea9956f56240b724f596b0347048cbc5a64621283ddc13621e7d26a027c0';
  function updateTodaysOrders() {
    fetch('https://minitzgo.com/api/todays_orders.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey_todaysOrders
      },
      body: requestBody
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('todays_orders').textContent = data.count;
      })
      .catch(() => {
        document.getElementById('todays_orders').textContent = 'Error fetching today\'s orders';
      });
  }

  function updateDashboardData() {
    fetchProductCount();
    updateTotalOrders();
    updateTotalSale();
    updateTodaysOrders();
  }

  updateDashboardData();
  setInterval(updateDashboardData, 5000);

});
