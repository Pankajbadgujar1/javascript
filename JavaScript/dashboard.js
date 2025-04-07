// dashboard.js - Place this in your JavaScript folder

document.addEventListener("DOMContentLoaded", function() {
    // Check if user is authenticated, redirect if not
    if (!checkAuth(true)) {
        // checkAuth will handle the redirect
        return;
    }
    
    // Get user info
    const user = getUserInfo();
    const userInfoElement = document.getElementById("userInfo");
    
    if (user && userInfoElement) {
        userInfoElement.innerHTML = `
            <p>Email: ${user.email}</p>
        `;
    }
});