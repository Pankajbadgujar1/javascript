// Firstly check authentication status when page loads
document.addEventListener("DOMContentLoaded", function() {
  // If already logged in, redirect to dashboard
  checkAuth(false);
});


function submitForm(){
    console.log("inside function 1 function");
    const first = document.getElementById('firstname').value.trim();
    console.log(first);
    const last = document.getElementById('lastname').value.trim();
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value.trim();


    /*Get error Containers*/
    const firstError = document.getElementById("firstError");
    const lastError = document.getElementById("lastError");
    const emailError = document.getElementById("emailError");
    const passError = document.getElementById("passError");

    console.log(passError);
    console.log(lastError);
    console.log(emailError);
    console.log(passError);



    /*Reset all error Messages */

    firstError.innerText = "";
    lastError.innerText = "";
    emailError.innerText="";
    passError.innerText="";
    console.log("all erase");

     // Regular Expressions
     const nameRegex = /^[A-Za-z]+$/;
     const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
     const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

     let isValid = true;
    console.log(isValid);
     // first name validation
 
     if (!nameRegex.test(last)){
      console.log("first name");
      firstError.innerText = "Please enter a valid first name (Letters only).";
      isValid = false;;
     }

     
      // Last name validation
      if (!nameRegex.test(last)) {
        console.log("last name");
        lastError.innerText = "Please enter a valid last name (letters only).";
        isValid = false;
      }


      // Email validation
      if (!emailRegex.test(email)) {
        console.log("email error");
        emailError.innerText = "Please enter a valid email address.";
        isValid = false;
      }

      

      // Password validation
      // if (!passRegex.test(pass)) {
      //   console.log("password error");
      //   passError.innerText = "Password must be at least 6 characters, include at least one letter and one number.";
      //   isValid = false;

      // }

      //Password bypass

      
      

      if(!pass){

       passError.innerText = "Password must be at least 6 characters, include at least one letter and one number.";
        isValid = false;

      }

      const formData = {
        first_name: first,
        last_name: last,
        email: email,
        password: pass
      };
      // Final check
      console.log(isValid);
      if (isValid) {

        fetch("http://127.0.0.1:8000/signup/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        })
          .then(response => {
            return response.json().then(data => {
              if (!response.ok) {
                // Show the actual error returned by Django
                throw new Error(JSON.stringify(data));
              }
              return data;
            });
          })
          .then(data => {
            alert("User signed up successfully!");
            console.log("Response from server:", data);
          })
          .catch(error => {
            console.error("Signup failed:", error);
            alert("Signup failed: " + error.message);
          });
        
        //console.log("valid");
        //alert(`Welcome, ${first} ${last}! You have signed in successfully.`);
        
      }

    
      
    };

























/*
    console.log("inside function 2 function");
    if (first && last && email && pass) {
        console.log("if");
        alert(`Hello ${first} ${last}, you are now signed in!`);
      } else {
            console.log('else');
        alert("Please fill in all fields.");
      }
*/

