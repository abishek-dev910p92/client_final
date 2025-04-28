
// Function to send CID to the API and fetch the verify result
function fetchClientVerify() {
  const cid = localStorage.getItem('dbUser') ? JSON.parse(localStorage.getItem('dbUser')).cid : null;

  if (!cid) {
    console.error("CID not found in local storage.");
    document.getElementById('verifyResult').textContent = 'CID not found';
    return;
  }

  // Prepare the data to send
  const postData = {
    cid: cid  // Send the cid from localStorage
  };

  // Send the POST request to the API
  fetch('https://minitzgo.com/api/client_verify.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': "4b17f164625a65b13534bf3affbe409d0ecf847994e57f0cb1578daea110b1c1"
    },
    body: JSON.stringify(postData)  // Convert the data to JSON
  })
    .then(response => response.json())  // Parse the response as JSON
    .then(data => {
      console.log('Response from API:', data);
      const verifyField = data.length > 0 && data[0].verify !== undefined ? data[0].verify : null;

      if (!verifyField || verifyField.trim() === "") {
        // Show "Not Verified" if verify field is null or empty
        document.getElementById('verifyResult').innerHTML = `Not Verified <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
</svg>`;
      } else if (verifyField == "verified") {
        // Show "Verified Partner" with a blue tick badge if verify field contains data
        document.getElementById('verifyResult').innerHTML = `Verified Partner <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-patch-check-fill" viewBox="0 0 16 16">
  <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
</svg>`;
      } else {
        document.getElementById('verifyResult').innerHTML = `Not Verified <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
      </svg>`;
      }

    })
    .catch(error => {
      console.error('Error fetching verify data:', error);
      document.getElementById('verifyResult').textContent = 'Error fetching verify data';
    });
}


// Call the function on page load to fetch verify status
fetchClientVerify();
