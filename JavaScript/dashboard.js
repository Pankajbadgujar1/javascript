// Redirects user if not authenticated
document.addEventListener("DOMContentLoaded", function () {
  if (!checkAuth(true)) return; // checkAuth handles redirection
  
  // Initialize the DataTable once the DOM is loaded
  initializeDataTable();
  
  // Set up form submission handler
  setupFormHandler();
  
  // Display user info
  displayUserInfo();
});

// Displays user info from access token
function displayUserInfo() {
  const user = getUserInfo();
  const userInfoElement = document.getElementById("userInfo");

  if (user && userInfoElement) {
    userInfoElement.innerHTML = `
      <p><strong>Email:</strong> ${user.email}</p>
      ${user.username ? `<p><strong>Username:</strong> ${user.username}</p>` : ''}
    `;
  } else if (userInfoElement) {
    userInfoElement.innerHTML = `<p>Unable to load user info. Please log in again.</p>`;
  }
}

const baseURL = "http://127.0.0.1:8000/brands/";

// Initialize DataTable with AJAX source
function initializeDataTable() {
  const access_token = getCookie("access_token");
  if (!access_token) return alert("Access token missing. Please login.");

  // Destroy existing DataTable if it exists
  if ($.fn.DataTable.isDataTable("#brandsTable")) {
    $('#brandsTable').DataTable().destroy();
  }
  
  // Initialize DataTable with AJAX
  $('#brandsTable').DataTable({
    ajax: {
      url: baseURL,
      headers: { Authorization: `Bearer ${access_token}` },
      dataSrc: "" // Empty string because response is an array directly
    },
    columns: [
      { data: "id" },
      { data: "brand_name" },
      { 
        data: "brand_description",
        render: function(data) {
          return data || "N/A";
        }
      },
      { 
        data: "brand_logo",
        render: function(data) {
          return data || "N/A";
        }
      },
      { 
        data: "id", 
        render: function(data) {
          return `<button class="update-btn btn btn-primary btn-sm" data-id="${data}">Update</button>`;
        }
      },
      { 
        data: "id", 
        render: function(data) {
          return `<button class="delete-btn btn btn-danger btn-sm" data-id="${data}">Delete</button>`;
        }
      }
    ],
    responsive: true,
    dom: 'Bfrtip',
    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]]
  });
}

// Refresh the DataTable data
function refreshTable() {
  if ($.fn.DataTable.isDataTable("#brandsTable")) {
    $('#brandsTable').DataTable().ajax.reload();
  } else {
    initializeDataTable();
  }
}

// Set up the form handler for adding/updating brands
function setupFormHandler() {
  document.getElementById('brandForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const access_token = getCookie("access_token");
    if (!access_token) return alert("Access token missing. Please login.");
    
    const brandId = document.getElementById('brandId').value;
    const brandName = document.getElementById('brandName').value;
    const brandDesc = document.getElementById('brandDesc').value;
    
    if (!brandName) {
      alert("Brand name is required!");
      return;
    }
    
    const brandData = {
      brand_name: brandName,
      brand_description: brandDesc
    };
    
    const method = brandId ? "PUT" : "POST";
    const url = brandId ? `${baseURL}${brandId}/` : baseURL;
    
    fetch(url, {
      method: method,
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}` 
      },
      body: JSON.stringify(brandData)
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(data => {
          throw new Error(JSON.stringify(data));
        });
      }
      return res.json();
    })
    .then(data => {
      alert(`Brand ${brandId ? "updated" : "added"} successfully!`);
      resetForm();
      refreshTable();
    })
    .catch(err => {
      alert("Error: " + err.message);
    });
  });
}

// Reset the form fields
function resetForm() {
  document.getElementById('brandId').value = '';
  document.getElementById('brandName').value = '';
  document.getElementById('brandDesc').value = '';
  document.querySelector('#brandForm button').textContent = 'Submit';
}

// Handle update button click - Pre-fill form
$(document).on("click", ".update-btn", function() {
  const id = $(this).data("id");
  const access_token = getCookie("access_token");
  
  // Fetch the current data for this brand
  fetch(`${baseURL}${id}/`, {
    headers: { Authorization: `Bearer ${access_token}` }
  })
  .then(res => res.json())
  .then(brand => {
    document.getElementById('brandId').value = brand.id;
    document.getElementById('brandName').value = brand.brand_name;
    document.getElementById('brandDesc').value = brand.brand_description || '';
    document.querySelector('#brandForm button').textContent = 'Update Brand';
    
    // Scroll to the form
    document.getElementById('brandForm').scrollIntoView({ behavior: 'smooth' });
  })
  .catch(err => alert("Error fetching brand details: " + err));
});

// Handle delete button click - Delete brand and refresh table
$(document).on("click", ".delete-btn", function() {
  const id = $(this).data("id");
  if (!confirm(`Are you sure you want to delete brand ID ${id}?`)) return;

  const access_token = getCookie("access_token");
  if (!access_token) return alert("Access token missing.");

  fetch(`${baseURL}${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access_token}` }
  })
  .then(res => {
    if (res.ok) {
      alert(`Brand ${id} deleted successfully.`);
      refreshTable(); // Refresh table using DataTables API
    } else {
      return res.json().then(data => alert("Error: " + JSON.stringify(data)));
    }
  })
  .catch(err => alert("Error: " + err));
});