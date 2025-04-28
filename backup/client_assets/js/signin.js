document.addEventListener("DOMContentLoaded", function () {
    const signInBtn = document.getElementById("signInBtn");

    if (signInBtn) {
        signInBtn.addEventListener("click", handleSignIn);
    } else {
        console.error("Error: Sign-in button not found.");
    }
});

function handleSignIn() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!emailInput || !passwordInput) {
        alert("Error: Input fields not found. Check your HTML.");
        return;
    }

    const emailOrPhone = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (emailOrPhone === "" || password === "") {
        alert("⚠️ All fields are required.");
        return;
    }

 

    fetch("https://minitzgo.com/api/fetch_client.php", {
        method: "POST", // Use POST for login validation
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": "703561448723f11eaaf0da586845be5b006bb5ebbda82344291547fd1a662bf2"
        },
        body: JSON.stringify({ email_or_phone: emailOrPhone, password: password }) // Send login data to the server
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ API Response:", data);

        if (data.status && data.user) {
            console.log("✅ Login successful:", data.user);
            localStorage.setItem("dbUser", JSON.stringify(data.user));
            window.location.href = "profile.html"; // Redirect to profile page
        } else {
            alert("❌ Invalid email/phone or password.");
        }
    })
    .catch(error => {
        console.error("❌ Error fetching user information:", error);
        alert("❌ Error fetching user information. Please try again.");
    });
}

