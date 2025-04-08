document.addEventListener("DOMContentLoaded", function() {
    // Check if user is authenticated, redirect if not
    if (!checkAuth(true)) {
        // checkAuth will handle the redirect
        return;
    }
});
    
    // Get user info
    window.addEventListener("DOMContentLoaded", () => {
        const user = getUserInfo();
        console.log("User email,", user)
        const userInfoElement = document.getElementById("userInfo");
        console.log("userInfoElement",userInfoElement);
        if (user && userInfoElement) {
          userInfoElement.innerHTML = `
            <p><strong>Email:</strong> ${user.email}</p>
            ${user.username ? `<p><strong>Username:</strong> ${user.username}</p>` : ''}
          `;
        } else if (userInfoElement) {
          userInfoElement.innerHTML = `<p>Unable to load user info. Please log in again.</p>`;
        }
      });



//************************************************************************* */
// script.js
const baseURL = "http://127.0.0.1:8000/brands/";

// function getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
//   return null;
// }

function displayResponse(data) {
  document.getElementById("api-response").textContent = JSON.stringify(data, null, 2);
}

function fetchBrands() {
  fetch(baseURL)
    .then(res => res.json())
    .then(displayResponse)
    .catch(err => displayResponse({ error: err.toString() }));
}

function getBrandById() {
  const id = document.getElementById("getId").value;
  if (!id) return alert("Please enter an ID");

  const access_token = getCookie("access_token");
  if (!access_token) return alert("Access token missing. Please login.");

  fetch(`${baseURL}${id}/`, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
    .then(res => res.json())
    .then(displayResponse)
    .catch(err => displayResponse({ error: err.toString() }));
}

document.getElementById("brandForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const id = document.getElementById("brandId").value;
  const name = document.getElementById("brandName").value;
  const desc = document.getElementById("brandDesc").value;

  const access_token = getCookie("access_token");
  if (!access_token) return alert("Access token missing. Please login.");

  const data = {
    brand_name: name,
    brand_description: desc || null
  };

  const url = id ? `${baseURL}${id}/` : baseURL;
  const method = id ? "PUT" : "POST";

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(response => {
      alert(`Brand ${id ? "updated" : "created"} successfully!`);
      displayResponse(response);
      fetchBrands();
    })
    .catch(err => displayResponse({ error: err.toString() }));
});

function deleteBrandById() {
  const id = document.getElementById("deleteId").value;
  if (!id) return alert("Please enter an ID to delete");

  const access_token = getCookie("access_token");
  if (!access_token) return alert("Access token missing. Please login.");

  if (!confirm(`Are you sure you want to delete brand ID ${id}?`)) return;

  fetch(`${baseURL}${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
    .then(res => {
      if (res.status === 204 || res.status === 200) {
        alert(`Brand ${id} deleted successfully.`);
        displayResponse({ status: "Deleted", id });
        fetchBrands();
      } else {
        return res.json().then(data => displayResponse(data));
      }
    })
    .catch(err => displayResponse({ error: err.toString() }));
}
