 
window.addEventListener("load", function () {
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
      function (position) {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          var googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

          var visits = {
              url: window.location.href,
              timestamp: new Date().toISOString(),
              device: navigator.userAgent,
              location: googleMapsLink // Send Google Maps link
          };

          $.ajax({
              url: "https://minitzgo.com/api/live_traffic.php",
              type: "POST",
              headers: { "X-API-KEY": "6acb6c2c195d9262fb40dc577ac5bb5627c0d1deb4917e545ec15914250891d3" },
              data: JSON.stringify(visits),
              contentType: "application/json",
              success: function (response) {
                  console.log("✅ Visit logged successfully:", response);
              },
              error: function (xhr, status, error) {
                  console.error("❌ Error inserting visit:", xhr.responseText || error);
              }
          });
      },
      function (error) {
          console.error("❌ Error getting location:", error.message);
          sendDataWithoutLocation();
      }
  );
} else {
  console.error("❌ Geolocation not supported by this browser.");
  sendDataWithoutLocation();
}

// Fallback function to send data if location is unavailable
function sendDataWithoutLocation() {
  var visits = {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      device: navigator.userAgent,
      location: "Location access denied" // Handle no location scenario
  };

  $.ajax({
      url: "https://minitzgo.com/api/live_traffic.php",
      type: "POST",
      headers: { "X-API-KEY": "6acb6c2c195d9262fb40dc577ac5bb5627c0d1deb4917e545ec15914250891d3" },
      data: JSON.stringify(visits),
      contentType: "application/json",
      success: function (response) {
          console.log("✅ Visit logged successfully (without location):", response);
      },
      error: function (xhr, status, error) {
          console.error("❌ Error inserting visit:", xhr.responseText || error);
      }
  });
}

});

 