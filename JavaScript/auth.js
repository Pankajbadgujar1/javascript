// auth.js - Place this in your JavaScript folder

// Check if user is authenticated by examining cookies
function isAuthenticated() {
    const accessToken = getCookie("access_token");
    const refreshToken = getCookie("refresh_token");
    return !!(accessToken && refreshToken);
  }
  
  // Helper function to get a cookie by name (reused from your logout.js)
  function getCookie(name) {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="));
    return cookieValue ? cookieValue.split("=")[1] : null;
  }
  
  // Redirect based on authentication status
  function checkAuth(requiresAuth) {
    const isLoggedIn = isAuthenticated();
    
    if (requiresAuth && !isLoggedIn) {
      // User needs to be logged in but isn't
      console.log("Access denied: Authentication required");
      window.location.href = "sign_in.html";
      return false;
    } 
    
    if (!requiresAuth && isLoggedIn) {
      // User is logged in but trying to access a page that requires being logged out
      console.log("Already authenticated: Redirecting to dashboard");
      window.location.href = "dashboard.html";
      return false;
    }
    
    return true;
  }
  
  // Get user info from token (basic implementation)
  function getUserInfo() {
    const accessToken = getCookie("access_token");
    if (!accessToken) return null;
    
    // In a real application, you might decode the JWT token
    // For now, we'll just return a placeholder
    return {
      email: "user@example.com" // This would come from your token in a real app
    };
  }