// First, check authentication status when page loads
document.addEventListener("DOMContentLoaded", function() {
  // If already logged in, redirect to dashboard
  checkAuth(false);
});

function SignInForm(){
  console.log("signInForm");
  const email = document.getElementById('email').value.trim();
  const pass = document.getElementById('password').value.trim();

  /*Get error Containers*/
  const emailError = document.getElementById("emailError");
  const passError = document.getElementById("passError");

  /*Reset all error Messages */
  emailError.innerText="";
  passError.innerText="";
  console.log("all erase");

   // Regular Expressions
   const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
   const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

   let isValid = true;
  console.log(isValid);

    // Email validation
    if (!emailRegex.test(email)) {
      console.log("email error");
      emailError.innerText = "Please enter a valid email address.";
      isValid = false;
    }

    // Password validation
    if(!pass){
      passError.innerText = "Password must be at least 6 characters, include at least one letter and one number.";
      isValid = false;
    }

    const formData = {
      email: email,
      password: pass
    };
    
    // Final check
    console.log(isValid);
    if (isValid) {
      fetch("http://127.0.0.1:8000/signin/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then(async (response) => {
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.errors || "Invalid credentials");
          }
    
          //  Set cookies ONLY if login is successful
          document.cookie = `access_token=${data.access}; path=/`;
          document.cookie = `refresh_token=${data.refresh}; path=/`;
    
          console.log("Access Token:", data.access);
          console.log("Refresh Token:", data.refresh);
    
          alert("User SignIn successfully!");
          window.location.href = "dashboard.html"; // Redirect to dashboard after login
        })
        .catch((error) => {
          console.error("Signin failed:", error);
          alert("Signin failed: " + error.message);
        });
    }
};

// Helper function to get a cookie by name
function getCookie(name) {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookieValue ? cookieValue.split("=")[1] : null;
}

















