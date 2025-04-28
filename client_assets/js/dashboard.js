



document.addEventListener('DOMContentLoaded', function () {
  let total_orders = 0;
  let total_products = 0;
  let ordersProductsBarChart = null;
  let ordersProductsLineChart = null;
  let monthlyOrderData = []; // To store the order data by month



  // ====================
  // Status Integration
  // ====================
  function getCurrentStatus() {
    return localStorage.getItem('client_status') || 'offline';
  }

  function updateStatusDisplay() {
    const status = getCurrentStatus();
    const statusElement = document.getElementById('userStatusDisplay');

    if (statusElement) {
      statusElement.textContent = status === 'online' ? '🟢 Online' : '🔴 Offline';
      statusElement.style.color = status === 'online' ? '#28a745' : '#dc3545';
    }
  }

  function setupStatusListener() {
    // Update immediately
    updateStatusDisplay();

    // Listen for changes from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === 'client_status') {
        updateStatusDisplay();
      }
    });
  }

  // ====================
  // Modified Initialization
  // ====================
  function initializeDashboard() {
    onPageLoad();
    setupStatusListener(); // Add this line

    // Wait for DOM and initialize charts
    setTimeout(() => {
      initializeCharts();
      updateDashboardData();
    }, 100);
  }

  // Start the application
  initializeDashboard();


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
        total_products = data.count || 0;
        document.getElementById('totalProductsCount').textContent = total_products;
        document.getElementById('totalProductsCount2').textContent = total_products;
        document.getElementsByClassName
        scheduleChartUpdate();
      })
      .catch(error => {
        // console.error('Error fetching products:', error);
        document.getElementById('totalProductsCount').textContent = 'Error';
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
        total_orders = data.count || 0;
        document.getElementById('total_orders').textContent = total_orders;
        document.getElementById('total_orders2').textContent = total_orders;
        monthlyOrderData = data.data || []; // Store the order data
        scheduleChartUpdate();
      })
      .catch(error => {
        // console.error('Error fetching orders:', error);
        document.getElementById('total_orders').textContent = 'Error';
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
        return response.json();
      })
      .then(data => {
        const totalSales = data.total_amount;
        const totalSalesWithRupee = "₹ " + (totalSales || 0);

        // Update both elements
        document.getElementById('total_sale').textContent = totalSalesWithRupee;
        document.getElementById('total_sale2').textContent = totalSalesWithRupee;
      })
      .catch(error => {
        const errorMessage = 'Error fetching total sales';

        // Update both elements with error message
        document.getElementById('total_sale').textContent = errorMessage;
        document.getElementById('total_sale2').textContent = errorMessage;
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
        document.getElementById('todays_orders').textContent = data.count || 0;
        document.getElementById('todays_orders2').textContent = data.count || 0;
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

  // Process order data by month
  function getMonthlyOrderData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthCounts = new Array(12).fill(0);

    monthlyOrderData.forEach(order => {
      if (order.date) {
        const date = new Date(order.date);
        const month = date.getMonth(); // 0-11
        monthCounts[month]++;
      }
    });

    return {
      labels: months,
      data: monthCounts
    };
  }

  let chartUpdatePending = false;
  function scheduleChartUpdate() {
    if (!chartUpdatePending) {
      chartUpdatePending = true;
      setTimeout(() => {
        updateCharts();
        chartUpdatePending = false;
      }, 100);
    }
  }

  function initializeCharts() {
    destroyCharts();
    createCharts();
  }

  function destroyCharts() {
    if (ordersProductsBarChart) {
      ordersProductsBarChart.destroy();
      ordersProductsBarChart = null;
    }
    if (ordersProductsLineChart) {
      ordersProductsLineChart.destroy();
      ordersProductsLineChart = null;
    }
  }

  function createCharts() {
    // Bars Chart (unchanged)
    const barsCtx = document.getElementById('chart-bars').getContext('2d');
    ordersProductsBarChart = new Chart(barsCtx, {
      type: 'bar',
      data: {
        labels: ['Orders', 'Products'],
        datasets: [{
          label: 'Count',
          data: [total_orders, total_products],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)'
          ],
          borderWidth: 1
        }]
      },
      options: getCommonChartOptions('Orders vs Products')
    });

    // Line Chart (updated to show monthly orders)
    const monthlyData = getMonthlyOrderData();
    const lineCtx = document.getElementById('chart-line').getContext('2d');
    ordersProductsLineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: monthlyData.labels,
        datasets: [
          {
            label: 'Orders by Month',
            data: monthlyData.data,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.1,
            fill: true
          }
        ]
      },
      options: getCommonChartOptions('Monthly Orders Trend')
    });
  }

  function getCommonChartOptions(title) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: title,
          color: '#fff'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#fff',
            stepSize: 1 // Ensure whole numbers on Y-axis
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        x: {
          ticks: {
            color: '#fff'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    };
  }

  function updateCharts() {
    if (ordersProductsBarChart) {
      ordersProductsBarChart.data.datasets[0].data = [total_orders, total_products];
      ordersProductsBarChart.update();
    }
    if (ordersProductsLineChart) {
      const monthlyData = getMonthlyOrderData();
      ordersProductsLineChart.data.labels = monthlyData.labels;
      ordersProductsLineChart.data.datasets[0].data = monthlyData.data;
      ordersProductsLineChart.update();
    }
  }

  // Initialize everything
  onPageLoad();

  // Wait for DOM and initialize charts
  setTimeout(() => {
    initializeCharts();
    updateDashboardData();
  }, 100);

  // Update data every 5 seconds
  setInterval(updateDashboardData, 5000);
});

// document.addEventListener('DOMContentLoaded', function () {
//     // Configuration
//     const API_KEYS = {
//         TOTAL_PROD: 'a0c75839fca1668ac6cf45e464a22f4a16f4d2dcbc1e2a5aea4948df42e688ea',
//         TOTAL_ORDERS: '507ba0c2db06231a1a2ce2524f3e12b57d3bc6c0e9d47c5752f5fb9b8f87a3e8',
//         TOTAL_SALE: '7620f8aea22da44c728c8bd48a87707d4da3d6eef5b271d1d99231b1ef5c4c04',
//         TODAYS_ORDERS: '0205ea9956f56240b724f596b0347048cbc5a64621283ddc13621e7d26a027c0'
//     };

//     // State
//     let total_orders = 0;
//     let total_products = 0;
//     let ordersProductsBarChart = null;
//     let ordersProductsLineChart = null;
//     let monthlyOrderData = [];
//     let chartUpdatePending = false;

//     // DOM Elements
//     const elements = {
//         userName: document.getElementById('userName'),
//         fullName: document.getElementById('fullName'),
//         totalProductsCount: document.getElementById('totalProductsCount'),
//         totalProductsCount2: document.getElementById('totalProductsCount2'),
//         total_orders: document.getElementById('total_orders'),
//         total_orders2: document.getElementById('total_orders2'),
//         total_sale: document.getElementById('total_sale'),
//         total_sale2: document.getElementById('total_sale2'),
//         todays_orders: document.getElementById('todays_orders'),
//         todays_orders2: document.getElementById('todays_orders2'),
//         userStatusDisplay: document.getElementById('userStatusDisplay')
//     };

//     // Initialize the dashboard
//     function initializeDashboard() {
//         // Verify user is logged in
//         const dbUser = getDbUserFromLocalStorage();
//         if (!dbUser) {
//             window.location.href = 'sign-in.html';
//             return;
//         }

//         // Set up user info
//         setUserInfo(dbUser);
        
//         // Initialize status display
//         setupStatusListener();
        
//         // Set loading states
//         setLoadingStates();
        
//         // Initialize charts
//         initializeCharts();
        
//         // Fetch initial data
//         updateDashboardData();
        
//         // Set up periodic refresh (every 5 seconds)
//         setInterval(updateDashboardData, 5000);
//     }

//     // Helper Functions
//     function getDbUserFromLocalStorage() {
//         const dbUserJSON = localStorage.getItem('dbUser');
//         return dbUserJSON ? JSON.parse(dbUserJSON) : null;
//     }

//     function createUserName(dbUser) {
//         return dbUser && dbUser.first_name && dbUser.last_name
//             ? `${dbUser.first_name} ${dbUser.last_name}`
//             : 'User';
//     }

//     function setUserInfo(dbUser) {
//         const userName = createUserName(dbUser);
//         if (elements.userName) elements.userName.textContent = userName;
//         if (elements.fullName) elements.fullName.textContent = `Hello, ${userName} !!`;
        
//         // Store request body for API calls
//         this.requestBody = JSON.stringify({ cid: dbUser.cid });
//     }

//     function setLoadingStates() {
//         const loadingElements = [
//             'totalProductsCount', 'totalProductsCount2',
//             'total_orders', 'total_orders2',
//             'total_sale', 'total_sale2',
//             'todays_orders', 'todays_orders2'
//         ];
        
//         loadingElements.forEach(id => {
//             if (elements[id]) elements[id].textContent = 'Loading...';
//         });
//     }

//     // Status Functions
//     function getCurrentStatus() {
//         return localStorage.getItem('client_status') || 'offline';
//     }

//     function updateStatusDisplay() {
//         const status = getCurrentStatus();
//         if (elements.userStatusDisplay) {
//             elements.userStatusDisplay.textContent = status === 'online' ? '🟢 Online' : '🔴 Offline';
//             elements.userStatusDisplay.style.color = status === 'online' ? '#28a745' : '#dc3545';
//         }
//     }

//     function setupStatusListener() {
//         updateStatusDisplay();
//         window.addEventListener('storage', (event) => {
//             if (event.key === 'client_status') {
//                 updateStatusDisplay();
//             }
//         });
//     }

//     // Data Fetching Functions
//     function updateDashboardData() {
//         fetchProductCount();
//         updateTotalOrders();
//         updateTotalSale();
//         updateTodaysOrders();
//     }

//     function fetchProductCount() {
//         fetch('https://minitzgo.com/api/total_products.php', {
//             method: 'POST',
//             headers: { 
//                 'Content-Type': 'application/json', 
//                 'X-API-Key': API_KEYS.TOTAL_PROD 
//             },
//             body: this.requestBody
//         })
//         .then(response => {
//             if (!response.ok) throw new Error('Network response was not ok');
//             return response.json();
//         })
//         .then(data => {
//             total_products = data.count || 0;
//             updateElementValue('totalProductsCount', total_products);
//             updateElementValue('totalProductsCount2', total_products);
//             scheduleChartUpdate();
//         })
//         .catch(error => {
//             console.error('Error fetching products:', error);
//             updateElementValue('totalProductsCount', 'Error');
//             updateElementValue('totalProductsCount2', 'Error');
//         });
//     }

//     function updateTotalOrders() {
//         fetch('https://minitzgo.com/api/total_orders.php', {
//             method: 'POST',
//             headers: { 
//                 'Content-Type': 'application/json', 
//                 'X-API-Key': API_KEYS.TOTAL_ORDERS 
//             },
//             body: this.requestBody
//         })
//         .then(response => {
//             if (!response.ok) throw new Error('Network response was not ok');
//             return response.json();
//         })
//         .then(data => {
//             total_orders = data.count || 0;
//             monthlyOrderData = data.data || [];
//             updateElementValue('total_orders', total_orders);
//             updateElementValue('total_orders2', total_orders);
//             scheduleChartUpdate();
//         })
//         .catch(error => {
//             console.error('Error fetching orders:', error);
//             updateElementValue('total_orders', 'Error');
//             updateElementValue('total_orders2', 'Error');
//         });
//     }

//     function updateTotalSale() {
//         fetch('https://www.minitzgo.com/api/total_sale.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-api-key': API_KEYS.TOTAL_SALE
//             },
//             body: this.requestBody
//         })
//         .then(response => {
//             if (!response.ok) throw new Error('Network response was not ok');
//             return response.json();
//         })
//         .then(data => {
//             const totalSales = data.total_amount || 0;
//             const totalSalesWithRupee = "₹ " + totalSales;
//             updateElementValue('total_sale', totalSalesWithRupee);
//             updateElementValue('total_sale2', totalSalesWithRupee);
//         })
//         .catch(error => {
//             console.error('Error fetching total sales:', error);
//             updateElementValue('total_sale', 'Error');
//             updateElementValue('total_sale2', 'Error');
//         });
//     }

//     function updateTodaysOrders() {
//         fetch('https://minitzgo.com/api/todays_orders.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-API-Key': API_KEYS.TODAYS_ORDERS
//             },
//             body: this.requestBody
//         })
//         .then(response => {
//             if (!response.ok) throw new Error('Network response was not ok');
//             return response.json();
//         })
//         .then(data => {
//             updateElementValue('todays_orders', data.count || 0);
//             updateElementValue('todays_orders2', data.count || 0);
//         })
//         .catch(error => {
//             console.error("Error fetching today's orders:", error);
//             updateElementValue('todays_orders', 'Error');
//             updateElementValue('todays_orders2', 'Error');
//         });
//     }

//     function updateElementValue(elementId, value) {
//         if (elements[elementId]) {
//             elements[elementId].textContent = value;
//         }
//     }

//     // Chart Functions
//     function scheduleChartUpdate() {
//         if (!chartUpdatePending) {
//             chartUpdatePending = true;
//             setTimeout(() => {
//                 updateCharts();
//                 chartUpdatePending = false;
//             }, 100);
//         }
//     }

//     function initializeCharts() {
//         destroyCharts();
//         createCharts();
//     }

//     function destroyCharts() {
//         if (ordersProductsBarChart) {
//             ordersProductsBarChart.destroy();
//             ordersProductsBarChart = null;
//         }
//         if (ordersProductsLineChart) {
//             ordersProductsLineChart.destroy();
//             ordersProductsLineChart = null;
//         }
//     }

//     function createCharts() {
//         // Bars Chart
//         const barsCtx = document.getElementById('chart-bars')?.getContext('2d');
//         if (barsCtx) {
//             ordersProductsBarChart = new Chart(barsCtx, {
//                 type: 'bar',
//                 data: {
//                     labels: ['Orders', 'Products'],
//                     datasets: [{
//                         label: 'Count',
//                         data: [total_orders, total_products],
//                         backgroundColor: [
//                             'rgba(75, 192, 192, 0.6)',
//                             'rgba(54, 162, 235, 0.6)'
//                         ],
//                         borderWidth: 1
//                     }]
//                 },
//                 options: getCommonChartOptions('Orders vs Products')
//             });
//         }

//         // Line Chart
//         const lineCtx = document.getElementById('chart-line')?.getContext('2d');
//         if (lineCtx) {
//             const monthlyData = getMonthlyOrderData();
//             ordersProductsLineChart = new Chart(lineCtx, {
//                 type: 'line',
//                 data: {
//                     labels: monthlyData.labels,
//                     datasets: [
//                         {
//                             label: 'Orders by Month',
//                             data: monthlyData.data,
//                             borderColor: 'rgba(255, 99, 132, 1)',
//                             backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                             tension: 0.1,
//                             fill: true
//                         }
//                     ]
//                 },
//                 options: getCommonChartOptions('Monthly Orders Trend')
//             });
//         }
//     }

//     function getMonthlyOrderData() {
//         const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//         const monthCounts = new Array(12).fill(0);

//         monthlyOrderData.forEach(order => {
//             if (order.date) {
//                 const date = new Date(order.date);
//                 const month = date.getMonth(); // 0-11
//                 monthCounts[month]++;
//             }
//         });

//         return {
//             labels: months,
//             data: monthCounts
//         };
//     }

//     function getCommonChartOptions(title) {
//         return {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//                 legend: {
//                     position: 'top',
//                 },
//                 title: {
//                     display: true,
//                     text: title,
//                     color: '#fff'
//                 }
//             },
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     ticks: {
//                         color: '#fff',
//                         stepSize: 1
//                     },
//                     grid: {
//                         color: 'rgba(255, 255, 255, 0.1)'
//                     }
//                 },
//                 x: {
//                     ticks: {
//                         color: '#fff'
//                     },
//                     grid: {
//                         color: 'rgba(255, 255, 255, 0.1)'
//                     }
//                 }
//             }
//         };
//     }

//     function updateCharts() {
//         if (ordersProductsBarChart) {
//             ordersProductsBarChart.data.datasets[0].data = [total_orders, total_products];
//             ordersProductsBarChart.update();
//         }
//         if (ordersProductsLineChart) {
//             const monthlyData = getMonthlyOrderData();
//             ordersProductsLineChart.data.labels = monthlyData.labels;
//             ordersProductsLineChart.data.datasets[0].data = monthlyData.data;
//             ordersProductsLineChart.update();
//         }
//     }

//     // Start the dashboard
//     initializeDashboard();
// });