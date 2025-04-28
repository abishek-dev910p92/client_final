const dbUser = JSON.parse(localStorage.getItem('dbUser'));
const cid = dbUser ? dbUser.cid : null;
const requestBody = JSON.stringify({ cid });

console.log("cid:", cid);

document.addEventListener("DOMContentLoaded", function() {
    // Get the dropdown menu element
    var dropdownMenu = document.getElementById("dropdownMenu");

    // Get the dropdown toggle button element
    var dropdownToggleButton = document.getElementById("dropdownMenuButton");

    // Function to toggle the dropdown menu
    function toggleDropdown() {
        if (dropdownMenu.classList.contains("show")) {
            dropdownMenu.classList.remove("show");
        } else {
            dropdownMenu.classList.add("show");
        }
    }

    // Function to fetch notifications from the API
    function fetchNotifications() {
        // API endpoint URL
        var apiUrl = 'https://minitgo.com/api/orders_notification.php';
        // API key
        var apiKey = 'be0fbece0783dc6732b25d5fee7886b9';

        // Prepare the request body
        var requestBody = {
            cid: cid
        };

        // Make API request to fetch notifications
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Check if the API returned a 'No Records' message or an empty data structure
            if (data && data.status === false && data.message === 'No Records found') {
                console.log('No notifications available');
                updateNotificationCount(0); // Set notification count to 0 if no records
                renderNoNotificationsMessage(); // Render a message when no notifications are available
            } 
            // Handle case when data structure is valid and contains notifications
            else if (data && Array.isArray(data.data)) {
                renderNotifications(data.data);
                updateNotificationCount(data.data.length);
                playNotificationSound();
            } else {
                console.error('Unexpected data structure:', data);
                updateNotificationCount(0); // Set notification count to 0 if data structure is unexpected
            }
        })
        .catch(error => {
            console.error('Error fetching notifications:', error);
        });
    }

    // Function to update notification count
    function updateNotificationCount(count) {
        var notificationCountElement = document.getElementById('notificationCount');
        notificationCountElement.textContent = count;
    }

    // Function to play notification sound
    function playNotificationSound() {
        var notificationSound = document.getElementById('notificationSound');
        notificationSound.play();
    }

    // Function to render notifications
    function renderNotifications(notifications) {
        // Get the notification body element
        var notificationBody = document.getElementById("notificationbody");

        // Clear existing notifications
        notificationBody.innerHTML = '';

        // Iterate over each notification and create HTML dynamically
        notifications.forEach(notification => {
            var notificationHtml = `
                <li class="mb-2">
                    <a class="dropdown-item border-radius-md" href="javascript:;">
                        <div class="d-flex py-1">
                        
                            <div class="my-auto">
                                <img src=${notification.product_image} class="avatar avatar-sm me-3 ">
                            </div>
                            <div class="d-flex flex-column justify-content-center">
                                <h5 class="text-sm font-weight-normal mb-1">
                                    <span class="font-weight-bold">Order ID: ${notification.oid}</span> 
                                </h5>
                                <h6 class="text-sm font-weight-normal mb-1">
                                    <span class="font-weight-bold">${notification.product_title}</span> 
                                </h6>
                                
                                <p class="text-xs text-secondary mb-0">
                                    <i class="fa fa-clock me-1"></i>
                                    <span class="font-weight-bold">Date:</span> ${notification.date} : <span class="font-weight-bold">Time:</span> ${notification.time}
                                </p>
                                
                                <div class="mt-2">
                                    <button class="acceptButton btn btn-success btn-sm me-2" data-notification-id="${notification.oid}">Accept</button>
                                    <button class="rejectButton btn btn-danger btn-sm" data-notification-id="${notification.oid}">Reject</button>
                                </div>
                            </div>
                        </div>
                    </a>
                </li>
            `;
            // Append the notification HTML to the notification body
            notificationBody.innerHTML += notificationHtml;
        });

        // Add event listeners to accept and reject buttons
        var acceptButtons = document.querySelectorAll('.acceptButton');
        acceptButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                var notificationId = this.dataset.notificationId;
                var clientStatus = 'accepted'; // Set client status to 'accepted'
                sendDataToAnotherAPI(notificationId, clientStatus);
                updateNotificationCount(notifications.length - 1); // Update notification count
            });
        });

        var rejectButtons = document.querySelectorAll('.rejectButton');
        rejectButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                var notificationId = this.dataset.notificationId;
                var clientStatus = 'rejected'; // Set client status to 'not_accepted'
                sendDataToAnotherAPI(notificationId, clientStatus);
                updateNotificationCount(notifications.length - 1); // Update notification count
            });
        });
    }

    // Function to display "No notifications" message
    function renderNoNotificationsMessage() {
        var notificationBody = document.getElementById("notificationbody");
        notificationBody.innerHTML = '<li class="mb-2">No notifications</li>';
    }

    // Function to send data to another API
    function sendDataToAnotherAPI(notificationId, clientStatus) {
        var apiUrl = 'https://minitgo.com/api/client_order_confirmation.php';
        var apiKey = 'be0fbece0783dc6732b25d5fee7886b9';

        // Prepare the request body
        var requestBody = {
            oid: notificationId,
            clientStatus: clientStatus,
            cid: cid
        };

        // Make API request to send data
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Notification status updated:', data);
        })
        .catch(error => {
            console.error('Error updating notification status:', error);
        });
    }

    // Event listener for the dropdown toggle button
    dropdownToggleButton.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevents the click event from bubbling up
        toggleDropdown();
    });

    // Event listener to close the dropdown menu when clicking outside of it
    document.addEventListener("click", function(event) {
        var targetElement = event.target;
        if (!targetElement.closest(".dropdown")) {
            // If the click target is not within the dropdown menu, close the dropdown
            dropdownMenu.classList.remove("show");
        }
    });

    // Fetch notifications initially and then every half second
    fetchNotifications();
    setInterval(fetchNotifications, 500); // Fetch notifications every 500 milliseconds
});
