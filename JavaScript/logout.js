// Helper function to get a cookie by name
function getCookie(name) {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="));
    return cookieValue ? cookieValue.split("=")[1] : null;
  }
  
  // Ensure DOM is loaded before accessing elements
  document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");
  
    if (!logoutBtn) {
      console.error("Logout button not found!");
      return;
    }
  
    logoutBtn.addEventListener("click", async function () {
      const refresh_token = getCookie("refresh_token");
      const access_token = getCookie("access_token");
      console.log("Access Token:", getCookie("access_token"));
      console.log("Refresh Token:", getCookie("refresh_token"));

      if (!refresh_token || !access_token) {
        alert("Missing tokens. Please log in first.");
        return;
      }
  
      try {
        const response = await fetch("http://127.0.0.1:8000/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({
            refresh: refresh_token, // send correct token here
          }),
        });
  
        if (response.ok) {
          //  Clear both tokens from cookie
          document.cookie = "access_token=; Max-Age=0; path=/";
          document.cookie = "refresh_token=; Max-Age=0; path=/";
          
          alert("Logged out successfully!");
          window.location.href = "login.html"; // or your homepage
        } else {
          const errorData = await response.json();
          alert("Logout failed: " + (errorData.error || "Unknown error"));
        }
      } catch (err) {
        console.error("Logout error:", err);
        alert("Something went wrong.");
      }
    });
  });
  