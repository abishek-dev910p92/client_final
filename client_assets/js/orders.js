
// function getDbUserFromLocalStorage() {
//   const dbUserJSON = localStorage.getItem('dbUser');
//   if (dbUserJSON) {
//     return JSON.parse(dbUserJSON);
//   } else {
//     return null;
//   }
// }

// function createUserName(dbUser) {
//   if (dbUser && dbUser.first_name && dbUser.last_name) {
//     return `${dbUser.first_name} ${dbUser.last_name}`;
//   } else {
//     return 'User';
//   }
// }

// function onPageLoad() {
//   const dbUser = getDbUserFromLocalStorage();

//   if (dbUser) {
//     const userNameElement = document.getElementById('userName');

//     if (userNameElement) {
//       const userName = createUserName(dbUser);
//       userNameElement.textContent = userName;
//     }

//   } else {
//     window.location.href = 'sign-in.html';
//     // console.log('No user found');
//   }
// }

// onPageLoad()


// var win = navigator.platform.indexOf('Win') > -1;
// if (win && document.querySelector('#sidenav-scrollbar')) {
//   var options = {
//     damping: '0.5'
//   }
//   Scrollbar.init(document.querySelector('#sidenav-scrollbar'), options);
// }



// // Faizan- FetchLiveOrders function starts here

// $(document).ready(function () {

//   const clientDetails = JSON.parse(localStorage.getItem('dbUser'));
//   if (clientDetails && clientDetails.cid) {
//     const cid = clientDetails.cid;
//     function fetchLiveOrders() {
//       $.ajax({
//         url: 'https://minitzgo.com/api/fetch_live_orders.php',
//         type: 'POST',
//         dataType: 'json',
//         contentType: 'application/json', // Important for JSON data
//         headers: {
//           'X-API-Key': '9fbcd848f047c400b3f4398655c8c9ac80addaefca5d4f7f40bdfdc749e2c0dd', // Your API key
//         },
//         data: JSON.stringify({ cid: cid }),
//         success: function (response) {
//           // console.log("running live orders and total orders");

//           if (response.status == false || !response.data || response.data.length === 0) {
//             $('#demoTable tbody').empty(); // Clear existing table rows
//             return 0;
//           } else {
//             $('#demoTable tbody').empty();
//             $.each(response.data, function (index, order) {
//               var row = $('<tr></tr>');
//               row.append(
//                 '<td><div class="d-flex px-2 py-1"><div><img src= ' + order.product_image + ' class="avatar avatar-sm me-3" alt="user1"></div><div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">' +
//                 order.product_title +
//                 '</h6><p class="text-xs text-secondary mb-0 badge badge-sm">Qty: ' + order.quantity +
//                 ' Colour: ' + (order.product_color ? order.product_color : 'N/A') + '</p></div></div></td>');
//               row.append('<td><p class="text-lg badge badge-sm text-secondary mb-0">₹ ' + order.product_price + '</p></td>');
//               row.append(
//                 '<td><p class="text-xs font-weight-bold mb-0 badge text-white bg-gradient-secondary">' +
//                 order.oid + '</p><p class="text-xs badge text-secondary mb-0">' + order.payment_mode + '</p></td>');
//               row.append(
//                 '<td class="align-middle text-center text-sm"><span class="badge badge-sm bg-gradient-warning">' +
//                 order.product_status + '</span></td>');
//               row.append(
//                 '<td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' +
//                 order.date + '</span></td>');
//               row.append(
//                 '<td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' +
//                 order.time + '</span></td>');
//               row.append(
//                 '<td class="align-middle"><a href="javascript:;" class="cancel-order badge badge-sm bg-gradient-danger" data-oid="' + order.oid + '">Cancel Order</a></td>'
//               );
//               $('#demoTable tbody').append(row);
//             });

//             // Attach event listener for cancel order button
//             $('.cancel-order').on('click', function () {
//               var oid = $(this).data('oid');

//               // Show confirmation dialog
//               var confirmCancel = confirm("Are you sure you want to cancel the order?");

//               // If user confirms the cancellation
//               if (confirmCancel) {
//                 // Send cancel order request to API
//                 $.ajax({
//                   url: 'https://minitzgo.com/api/cancel_live_order.php', // API endpoint for cancel order
//                   type: 'POST',
//                   dataType: 'json',
//                   contentType: 'application/json',
//                   headers: {
//                     'X-API-Key': 'd0145238fabc26381f3e493ef5103144c6c496280d015bf23cef9ae3b09e87aa' // Include the X-API-Key in the request
//                   },
//                   data: JSON.stringify({
//                     product_status: 'rejected',  // Send clientStatus as 'rejected'
//                     cid: cid,                  // Include cid
//                     oid: oid                   // Include oid
//                   }),
//                   success: function (response) {
//                     if (response.status == true) {

//                       fetchLiveOrders(); // Refresh the orders
//                     } else {
//                       alert('Failed to cancel order');
//                     }
//                   },
//                   error: function (xhr, status, error) {
//                     // console.error('Error canceling order:', error);
//                   }
//                 });
//               }
//               // If user cancels the confirmation, do nothing
//             });
//           }
//         },
//         error: function (xhr, status, error) {
//           // console.error('Error fetching data:', error);
//         },
//         complete: function () {
//           setTimeout(fetchLiveOrders, 500); // Automatically refresh orders every 500ms
//         }
//       });
//     }


//     fetchLiveOrders();

//   }
//   else {
//     // console.error('Client details not found in local storage.');
//   }

// });

// // FetchLiveOrders function ends here


// // Faizan- FetchTotalOrders starts here
// $(document).ready(function () {

//   const clientDetails = JSON.parse(localStorage.getItem('dbUser'));
//   if (clientDetails && clientDetails.cid) {
//     const cid = clientDetails.cid;

//     function fetchTotalOrders() {
//       $.ajax({
//         url: 'https://minitzgo.com/api/fetch_total_orders.php',
//         type: 'POST',
//         dataType: 'json',
//         contentType: 'application/json',
//         headers: {
//           'X-API-Key': 'f32e401354228431eeedbe468055f9ed7abcbe3348bf96304e977a2d70af6ab8' // Include the X-API-Key in the request
//         },
//         data: JSON.stringify({ cid: cid }),
//         success: function (data) {

//           // console.log("TABLES ORDERS:", data)
//           if (data.status == false) {
//             $('#totalorders tbody').empty();
//             return 0;
//           } else {
//             $('#totalorders tbody').empty();
//             $.each(data, function (index, order) {
//               // Parse order time (format: "2025-04-03 09:45:14.4212222")
//               const orderDateTime = new Date(order.time.replace(' ', 'T') + 'Z'); // Convert to UTC by adding 'Z'
//               const currentDateTime = new Date(); // Gets current UTC time
//               const timeDifference = (currentDateTime - orderDateTime) / (1000 * 60); // Difference in minutes

//               // Check if 5 minutes have passed (using server UTC time)
//               const isExpired = timeDifference > 5;


//               var row = $('<tr></tr>');
//               row.append(
//                 '<td><div class="d-flex px-2 py-1"><div><img src=' + order.product_image + ' class="avatar avatar-sm me-3" alt="user1"></div><div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">' +
//                 order.product_title +
//                 '</h6><p class="text-xs text-secondary mb-0 badge badge-sm">Qty: ' + order.quantity +
//                 ' Colour: ' + order.product_color + '</p></div></div></td>');
//               row.append('<td><p class="text-lg badge badge-sm text-secondary mb-0">₹ ' + order
//                 .product_price + '</p></td>');
//               row.append(
//                 '<td><p class="text-xs font-weight-bold mb-0 badge text-white bg-gradient-secondary">' +
//                 order.oid + '</p><p class="text-xxs badge text-secondary mb-0">' + order
//                   .payment_mode + ' / <span class="text-success fs-6"> ' + order.client_amount + '₹</span></p></td>');
//               row.append(
//                 '<td class="align-middle text-center text-sm"><span class="badge badge-sm bg-gradient-primary">' +
//                 order.product_status + '</span></td>');
//               row.append(
//                 '<td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' +
//                 order.date + '</span></td>');
//               row.append(
//                 '<td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' +
//                 order.time + '</span></td>');
//               // Add disabled button if order is older than 5 minutes
//               if (isExpired) {
//                 row.append(
//                   '<td class="align-middle"><button class="btn btn-sm btn-secondary" disabled>Can\'t Accept Order</button></td>'
//                 );
//               } else {
//                 row.append(
//                   '<td class="align-middle"><a href="javascript:;" class="accept-order badge badge-sm bg-gradient-info" data-oid="' + order.oid + '">Accept Order</a></td>'
//                 );
//               }
//               $('#totalorders tbody').append(row);
//             });

//             // Attach event listener for cancel order button
//             $('.accept-order').on('click', function () {
//               var oid = $(this).data('oid');

//               // Show confirmation dialog
//               var confirmCancel = confirm("Are you sure you want to update the order?");

//               // If user confirms the cancellation
//               if (confirmCancel) {
//                 // Send cancel order request to API
//                 $.ajax({
//                   url: 'https://minitzgo.com/api/cancel_live_order.php', // API endpoint for cancel order
//                   type: 'POST',
//                   dataType: 'json',
//                   contentType: 'application/json',
//                   headers: {
//                     'X-API-Key': 'd0145238fabc26381f3e493ef5103144c6c496280d015bf23cef9ae3b09e87aa' // Include the X-API-Key in the request
//                   },
//                   data: JSON.stringify({
//                     product_status: 'Finding Delivery Boy',  // Send clientStatus as 'Finding Delivery Boy'
//                     cid: cid,                  // Include cid
//                     oid: oid                   // Include oid
//                   }),
//                   success: function (response) {
//                     if (response.status == true) {

//                       fetchLiveOrders(); // Refresh the orders
//                     } else {
//                       alert('Failed to update order');
//                     }
//                   },
//                   error: function (xhr, status, error) {
//                     // console.error('Error updating order:', error);
//                   }
//                 });
//               }
//               // If user cancels the confirmation, do nothing
//             });

//           }

//         },
//         error: function (xhr, status, error) {
//           // console.error('Error fetching data:', error);
//         },
//         complete: function () {
//           setTimeout(fetchTotalOrders, 500);
//         }
//       });


//     }
//     fetchTotalOrders();

//   }
//   else {
//     // console.error('Client details not found in local storage.');
//   }
//   // Listen for typing in the search bar
//   $('#searchInput').on('keyup', function() {
//     const searchTerm = $(this).val().toLowerCase();

//     // Filter rows in #demoTable (live orders)
//     $('#demoTable tbody tr').each(function() {
//       const rowText = $(this).text().toLowerCase();
//       $(this).toggle(rowText.includes(searchTerm));
//     });

//     // Filter rows in #totalorders (total orders)
//     $('#totalorders tbody tr').each(function() {
//       const rowText = $(this).text().toLowerCase();
//       $(this).toggle(rowText.includes(searchTerm));
//     });
//   });
// });

// // FetchTotalOrders ends here



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
    const userNameElement = document.getElementById('userName');

    if (userNameElement) {
      const userName = createUserName(dbUser);
      userNameElement.textContent = userName;
    }
  } else {
    $('#searchInput').val(''); // Clear search input
    window.location.href = 'sign-in.html';
  }
}

onPageLoad();

var win = navigator.platform.indexOf('Win') > -1;
if (win && document.querySelector('#sidenav-scrollbar')) {
  var options = {
    damping: '0.5'
  }
  Scrollbar.init(document.querySelector('#sidenav-scrollbar'), options);
}

// Global variable to store search term
let currentSearchTerm = '';

// Function to apply search filter
function applySearchFilter() {
  // Filter rows in #demoTable (live orders)
  $('#demoTable tbody tr').each(function() {
    const rowText = $(this).text().toLowerCase();
    $(this).toggle(rowText.includes(currentSearchTerm));
  });

  // Filter rows in #totalorders (total orders)
  $('#totalorders tbody tr').each(function() {
    const rowText = $(this).text().toLowerCase();
    $(this).toggle(rowText.includes(currentSearchTerm));
  });
}

// Faizan- FetchLiveOrders function starts here
$(document).ready(function () {
  const clientDetails = JSON.parse(localStorage.getItem('dbUser'));
  if (clientDetails && clientDetails.cid) {
    const cid = clientDetails.cid;
    
    function fetchLiveOrders() {
      $.ajax({
        url: 'https://minitzgo.com/api/fetch_live_orders.php',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
          'X-API-Key': '9fbcd848f047c400b3f4398655c8c9ac80addaefca5d4f7f40bdfdc749e2c0dd',
        },
        data: JSON.stringify({ cid: cid }),
        success: function (response) {
          if (response.status == false || !response.data || response.data.length === 0) {
            $('#demoTable tbody').empty();
            return 0;
          } else {
            $('#demoTable tbody').empty();
            $.each(response.data, function (index, order) {
              var row = $('<tr></tr>');
              row.append(
                '<td><div class="d-flex px-2 py-1"><div><img src= ' + order.product_image + ' class="avatar avatar-sm me-3" alt="user1"></div><div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">' +
                order.product_title +
                '</h6><p class="text-xs text-secondary mb-0 badge badge-sm">Qty: ' + order.quantity +
                ' Colour: ' + (order.product_color ? order.product_color : 'N/A') + '</p></div></div></td>');
              row.append('<td><p class="text-lg badge badge-sm text-secondary mb-0">₹ ' + order.product_price + '</p></td>');
              row.append(
                '<td><p class="text-xs font-weight-bold mb-0 badge text-white bg-gradient-secondary">' +
                order.oid + '</p><p class="text-xs badge text-secondary mb-0">' + order.payment_mode + '</p></td>');
              row.append(
                '<td class="align-middle text-center text-sm"><span class="badge badge-sm bg-gradient-warning">' +
                order.product_status + '</span></td>');
              row.append(
                '<td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' +
                order.date + '</span></td>');
              row.append(
                '<td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' +
                order.time + '</span></td>');
              row.append(
                '<td class="align-middle"><a href="javascript:;" class="cancel-order badge badge-sm bg-gradient-danger" data-oid="' + order.oid + '">Cancel Order</a></td>'
              );
              $('#demoTable tbody').append(row);
            });

            $('.cancel-order').on('click', function () {
              var oid = $(this).data('oid');
              var confirmCancel = confirm("Are you sure you want to cancel the order?");
              
              if (confirmCancel) {
                $.ajax({
                  url: 'https://minitzgo.com/api/cancel_live_order.php',
                  type: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  headers: {
                    'X-API-Key': 'd0145238fabc26381f3e493ef5103144c6c496280d015bf23cef9ae3b09e87aa'
                  },
                  data: JSON.stringify({
                    product_status: 'rejected',
                    cid: cid,
                    oid: oid
                  }),
                  success: function (response) {
                    if (response.status == true) {
                      fetchLiveOrders();
                    } else {
                      alert('Failed to cancel order');
                    }
                  },
                  error: function (xhr, status, error) {
                    console.error('Error canceling order:', error);
                  }
                });
              }
            });
          }
        },
        error: function (xhr, status, error) {
          console.error('Error fetching data:', error);
        },
        complete: function () {
          setTimeout(fetchLiveOrders, 500);
          applySearchFilter(); // Apply search filter after refresh
        }
      });
    }

    fetchLiveOrders();
  }
});

// Faizan- FetchTotalOrders starts here
$(document).ready(function () {
  const clientDetails = JSON.parse(localStorage.getItem('dbUser'));
  if (clientDetails && clientDetails.cid) {
    const cid = clientDetails.cid;

    function fetchTotalOrders() {
      $.ajax({
        url: 'https://minitzgo.com/api/fetch_total_orders.php',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
          'X-API-Key': 'f32e401354228431eeedbe468055f9ed7abcbe3348bf96304e977a2d70af6ab8'
        },
        data: JSON.stringify({ cid: cid }),
        success: function (data) {
          if (data.status == false) {
            $('#totalorders tbody').empty();
            return 0;
          } else {
            $('#totalorders tbody').empty();
            $.each(data, function (index, order) {
              const orderDateTime = new Date(order.time.replace(' ', 'T') + 'Z');
              const currentDateTime = new Date();
              const timeDifference = (currentDateTime - orderDateTime) / (1000 * 60);
              const isExpired = timeDifference > 5;

              var row = $('<tr></tr>');
              row.append(
                '<td><div class="d-flex px-2 py-1"><div><img src=' + order.product_image + ' class="avatar avatar-sm me-3" alt="user1"></div><div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">' +
                order.product_title +
                '</h6><p class="text-xs text-secondary mb-0 badge badge-sm">Qty: ' + order.quantity +
                ' Colour: ' + order.product_color + '</p></div></div></td>');
              row.append('<td><p class="text-lg badge badge-sm text-secondary mb-0">₹ ' + order
                .product_price + '</p></td>');
              row.append(
                '<td><p class="text-xs font-weight-bold mb-0 badge text-white bg-gradient-secondary">' +
                order.oid + '</p><p class="text-xxs badge text-secondary mb-0">' + order
                  .payment_mode + ' / <span class="text-success fs-6"> ' + order.client_amount + '₹</span></p></td>');
              row.append(
                '<td class="align-middle text-center text-sm"><span class="badge badge-sm bg-gradient-primary">' +
                order.product_status + '</span></td>');
              row.append(
                '<td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' +
                order.date + '</span></td>');
              row.append(
                '<td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' +
                order.time + '</span></td>');
              
              if (isExpired) {
                row.append(
                  '<td class="align-middle"><button class="btn btn-sm btn-secondary" disabled>Can\'t Accept Order</button></td>'
                );
              } else {
                row.append(
                  '<td class="align-middle"><a href="javascript:;" class="accept-order badge badge-sm bg-gradient-info" data-oid="' + order.oid + '">Accept Order</a></td>'
                );
              }
              $('#totalorders tbody').append(row);
            });

            $('.accept-order').on('click', function () {
              var oid = $(this).data('oid');
              var confirmCancel = confirm("Are you sure you want to update the order?");

              if (confirmCancel) {
                $.ajax({
                  url: 'https://minitzgo.com/api/cancel_live_order.php',
                  type: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  headers: {
                    'X-API-Key': 'd0145238fabc26381f3e493ef5103144c6c496280d015bf23cef9ae3b09e87aa'
                  },
                  data: JSON.stringify({
                    product_status: 'Finding Delivery Boy',
                    cid: cid,
                    oid: oid
                  }),
                  success: function (response) {
                    if (response.status == true) {
                      fetchLiveOrders();
                    } else {
                      alert('Failed to update order');
                    }
                  },
                  error: function (xhr, status, error) {
                    console.error('Error updating order:', error);
                  }
                });
              }
            });
          }
        },
        error: function (xhr, status, error) {
          console.error('Error fetching data:', error);
        },
        complete: function () {
          setTimeout(fetchTotalOrders, 500);
          applySearchFilter(); // Apply search filter after refresh
        }
      });
    }

    fetchTotalOrders();

    // Search functionality
    $('#searchInput').on('keyup', function() {
      currentSearchTerm = $(this).val().toLowerCase();
      applySearchFilter();
    });
  }
});