// // dashboard.js

// function getDbUserFromLocalStorage() {
//     const dbUserJSON = localStorage.getItem('dbUser');
//     if (dbUserJSON) {
//         return JSON.parse(dbUserJSON);
//     } else {
//         return null;
//     }
// }

// function createUserName(dbUser) {
//     if (dbUser && dbUser.first_name && dbUser.last_name) {
//         return `${dbUser.first_name} ${dbUser.last_name}`;
//     } else {
//         return 'User';
//     }
// }

// function onPageLoad() {
//     const dbUser = getDbUserFromLocalStorage();

//     if (dbUser) {
//         const userNameElement = document.getElementById('userName');
//         const clientName=document.getElementById('clientName');
//         const storeName=document.getElementById('storeName');
//         const clientAddress=document.getElementById('clientAddress');
//         const clientDescription=document.getElementById('clientDescription');
//         const fullName=document.getElementById('fullName');
//         const phoneNo=document.getElementById('phoneNo');
//         const clientEmail=document.getElementById('clientEmail')
//         const cid=document.getElementById('cid')





//             const userName = createUserName(dbUser);
//             userNameElement.textContent = userName;

//             clientName.textContent=userName
//             cid.textContent=dbUser.cid
//             storeName.textContent=dbUser.shop_name;
//             clientAddress.textContent=dbUser.client_address;
//             clientDescription.textContent=dbUser.client_description;
//             fullName.textContent=userName;
//             phoneNo.textContent=dbUser.client_phone;
//             clientEmail.textContent=dbUser.email;




//     } else {
//         window.location.href = 'sign-in.html';
        console.log('No user found');
//     }
// }

// onPageLoad()






















// ====================
// Utility Functions
// ====================
function getDbUserFromLocalStorage() {
    try {
        const dbUserJSON = localStorage.getItem('dbUser');
        return dbUserJSON ? JSON.parse(dbUserJSON) : null;
    } catch (error) {
        // console.error('Error parsing user data:', error);
        return null;
    }
}

function createUserName(dbUser) {
    if (!dbUser) return 'User';
    return [dbUser.first_name, dbUser.last_name].filter(Boolean).join(' ') || 'User';
}

function getCidFromLocalStorage() {
    const dbUser = getDbUserFromLocalStorage();
    if (!dbUser?.cid) {
        // console.error('CID not found in local storage');
        return null;
    }
    return dbUser.cid;
}

// ====================
// Status Management
// ====================
async function updateClientStatus(status) {
    const cid = getCidFromLocalStorage();
    if (!cid) {
        // console.error('CID is missing');
        return { success: false, error: 'CID missing' };
    }

    const statusText = status === '1' ? 'online' : 'offline';
    const requestData = { cid, client_status: statusText };

    try {
        // console.log('Sending status update:', requestData);
        const response = await fetch('https://minitzgo.com/api/client_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-api-key": "47700d1bb2b874b5fb55ff536c0f9d627feb023f8ed228652f364762a41f7690"
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log('Status update successful:', data);
        return { success: true, data };
    } catch (error) {
        // console.error('Status update failed:', error);
        return { success: false, error };
    }
}

// ====================
// UI Management
// ====================
function updateButtonStyles(activeButton) {
    const onlineButton = document.getElementById('onlineButton');
    const offlineButton = document.getElementById('offlineButton');

    const styles = {
        online: {
            active: { bg: '#007bff', text: '#ffffff' },
            inactive: { bg: 'transparent', text: '#007bff' }
        },
        offline: {
            active: { bg: '#dc3545', text: '#ffffff' },
            inactive: { bg: 'transparent', text: '#dc3545' }
        }
    };

    if (activeButton === 'online') {
        Object.assign(onlineButton.style, {
            backgroundColor: styles.online.active.bg,
            color: styles.online.active.text
        });
        Object.assign(offlineButton.style, {
            backgroundColor: styles.offline.inactive.bg,
            color: styles.offline.inactive.text
        });
    } else {
        Object.assign(offlineButton.style, {
            backgroundColor: styles.offline.active.bg,
            color: styles.offline.active.text
        });
        Object.assign(onlineButton.style, {
            backgroundColor: styles.online.inactive.bg,
            color: styles.online.inactive.text
        });
    }
}

function updateStatusDisplay(status) {
    const currentStatus = document.getElementById('currentStatus');
    const onlineMessage = document.getElementById('onlineMessage');
    const offlineMessage = document.getElementById('offlineMessage');

    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    currentStatus.textContent = capitalizedStatus;

    onlineMessage.style.display = status === 'online' ? 'block' : 'none';
    offlineMessage.style.display = status === 'offline' ? 'block' : 'none';
}

async function toggleButtonActive(status) {
    try {
        // Immediate UI feedback
        updateButtonStyles(status);
        updateStatusDisplay(status);

        // API call
        const result = await updateClientStatus(status === 'online' ? '1' : '0');

        if (!result.success) {
            throw result.error || new Error('Status update failed');
        }

        // Persist status on success
        localStorage.setItem('client_status', status);
    } catch (error) {
        // console.error('Status toggle failed:', error);
        // Revert to saved status
        applySavedStatus();
    }
}

function applySavedStatus() {
    const savedStatus = localStorage.getItem('client_status') || 'offline';
    updateButtonStyles(savedStatus);
    updateStatusDisplay(savedStatus);
}

// ====================
// Event Handlers
// ====================
function setupEventListeners() {
    // Status buttons
    document.getElementById('onlineButton')?.addEventListener('click', () => toggleButtonActive('online'));
    document.getElementById('offlineButton')?.addEventListener('click', () => toggleButtonActive('offline'));

    // Logout button
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('dbUser');
        localStorage.removeItem('client_status');
        window.location.href = 'login.html';
    });
}

// ====================
// Main Initialization
// ====================
function populateUserData(dbUser) {
    if (!dbUser) return;

    const elements = {
        userName: createUserName(dbUser),
        clientName: createUserName(dbUser),
        cid: dbUser.cid,
        storeName: dbUser.shop_name,
        clientAddress: dbUser.client_address,
        clientDescription: dbUser.client_description,
        fullName: createUserName(dbUser),
        phoneNo: dbUser.client_phone,
        clientEmail: dbUser.email
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value || 'N/A';
    });
}

function initializeDashboard() {
    const dbUser = getDbUserFromLocalStorage();

    if (!dbUser) {
        window.location.href = 'sign-in.html';
        return;
    }

    populateUserData(dbUser);
    setupEventListeners();
    applySavedStatus();
}

// Start the application
document.addEventListener('DOMContentLoaded', initializeDashboard);

var win = navigator.platform.indexOf('Win') > -1;
if (win && document.querySelector('#sidenav-scrollbar')) {
    var options = {
        damping: '0.5'
    }
    Scrollbar.init(document.querySelector('#sidenav-scrollbar'), options);
}