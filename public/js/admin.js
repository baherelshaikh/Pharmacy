const Token = localStorage.getItem("Token")
const userId = localStorage.getItem('userId')
document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();
// Admin Info Section
function fetchAdminInfo() {
// Fetch admin information from the backend
fetch(`http://localhost:5000/api/v1/user/${userId}`,{
method: 'GET', 
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`, // Include the token in the Authorization header
    }
})
.then(response => response.json())
.then(admin => {
    const {user} = admin
    // Select the container to insert admin info
    const adminDetails = document.getElementById("admin-details");

    // Clear any existing content
    adminDetails.innerHTML = "";

    // Create the admin information display
    adminDetails.innerHTML = `
        <img src="${user.image}" class= "admin-pic"></img>
        <p>Name: ${user.name}</p> <!-- Admin's name -->
        <p>Role: ${user.role}</p> <!-- Admin's role -->
        <p>Last Actoin: ${user.lastAction}</p> <!-- Last login time -->
        `;
})
.catch(error => console.error("Error fetching admin info:", error));
}

// Add New Products Section
function addNewProduct() {
const form = document.getElementById("add-product-form");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    async function uploadPruduct(){
        let file ;
        let userData= {};
        const formData = new FormData(form);
        formData.forEach((value, key) => {
            userData[key] = value;
        });
        const profileImageInput = document.getElementById('product-image')
        // Check if an image was selected
        if (profileImageInput.files.length > 0) {
            file = profileImageInput.files[0];    
            console.log(file)
            // Optional: Validate file size (e.g., max 2MB)
            const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSizeInBytes) {
            alert("File size must be less than 2MB.");
            profileImageInput.value = ""; // Clear the selected file
            return; // Exit early if file size is too large
            }

            // Append the image to the form data *********
            userData["image"] = []
            userData['image'][0] = file.name; // Include the image URL
            // formData.append("image", `${file.name}`);
        }
        // alert(`${userData}`)
        console.log(userData)
        
        try {
            const response = await fetch("http://localhost:5000/api/v1/product", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`, // Include the token in the Authorization header
            },
            body: JSON.stringify(userData)
            })
            if (response.ok) {
                // const { user } = await response.json();
                // console.log("Registration successful:", user);

                    // try {
                    const formData = new FormData();
                    formData.append("images", file); // Add the file to the FormData

                    const response = await fetch("http://localhost:5000/api/v1/product/uploadImage", {
                        method: "POST",
                        headers: {
                            // 'Content-Type': 'application/json',
                            'Authorization': `Bearer ${Token}`, 
                        },
                        body: formData, // Upload the image to the server
                    });

                    if (response.ok) {
                        // const { userImage } = await response.json(); // Get the image URL from the response
                        // uploadedImageUrl = userImage; // Store the image URL
                        // window.location.href = "index.html"; // Example redirect after registration
                        console.log( 'images uploaded')
                        } else {
                        console.error("Image upload failed:", response.statusText); // Handle error
                        return; // Exit if image upload fails
                    }
                    // } catch (error) {
                    // console.error("Error uploading image:", error); // Log the error
                    // return; // Exit to prevent form submission
                    // }
            }else {
                console.error("image uploading failed:", response.statusText);
            }
        } catch (error) {
            // console.error("uploading failed:", response.statusText);
        }
    }
fetchAdminInfo()
uploadPruduct()
});
}

// Delete Products Section
function deleteProduct() {
const deleteButton = document.getElementById("delete-product-button");
const select = document.getElementById("delete-product-select");

async function fetchoptions (){
    // Fetch product list for dropdown
    fetch("http://localhost:5000/api/v1/product")
        .then(response => response.json())
        .then(items=>{
            const {products} = items
            return products
        })
        .then(products => {
            products.forEach(product => {
                const option = document.createElement("option");
                option.value = product._id;
                option.textContent = product.name;
                select.appendChild(option);
            });
        });
}
fetchoptions();

deleteButton.addEventListener("click", () => {
    const selectedProductId = select.value;
    fetch(`http://localhost:5000/api/v1/product/${selectedProductId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`, // Include the token in the Authorization header
        },
    })
    .then(response => response.json())
    .then(() => {
        alert("Product deleted: "+ selectedProductId)

        let child = select.firstChild ? select.firstChild.nextSibling : null;
        while (child) {
            const next = child.nextSibling; // Save the reference to the next sibling
            select.removeChild(child); // Remove the current child
            child = next; // Move to the next sibling
        }
        fetchoptions();
        // console.log("Product deleted:", selectedProductId);
    })
    .catch(error => console.error("Error deleting product:", error));
});
fetchAdminInfo();
}

// Download Orders Report Section
function downloadOrdersReport() {
const downloadButton = document.getElementById("download-report");
downloadButton.addEventListener("click", () => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    fetch('http://localhost:5000/api/v1/order/getTodayOrders',{
        method:'GET',
        headers:{
            'Authorization': `Bearer ${Token}`,
            'Content-Type': 'application/pdf', 
        }
    })
        .then(response => {
            if (response.ok) {
                return response.blob(); // Get the report as a file
            } else {
                throw new Error("Failed to download report");
            }
        })
        .then(blob => {
            const url = URL.createObjectURL(blob); // Create a download URL
            const a = document.createElement("a");
            a.href = url;
            a.download = `orders_report_${today}.pdf`; // Suggested file name
            a.click(); // Simulate a click to download the file
            URL.revokeObjectURL(url); // Revoke the URL after download
        })
        .catch(error => console.error("Error downloading report:", error));
});
}

function getClientAddress() {
    const downloadButton = document.getElementById("get-addresses");
    downloadButton.addEventListener("click", () => {
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        fetch('http://localhost:5000/api/v1/order/getClientAddress',{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${Token}`,
                'Content-Type': 'application/pdf', 
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.blob(); // Get the report as a file
                } else {
                    throw new Error("Failed to download report");
                }
            })
            .then(blob => {
                const url = URL.createObjectURL(blob); // Create a download URL
                const a = document.createElement("a");
                a.href = url;
                a.download = `Clients'_Addresses_${today}.pdf`; // Suggested file name
                a.click(); // Simulate a click to download the file
                URL.revokeObjectURL(url); // Revoke the URL after download
            })
            .catch(error => console.error("Error downloading report:", error));
    });
    }
// Initialize all sections
// Function to fetch orders and populate the table
function fetchAndDisplayOrders() {
const orderTableBody = document.getElementById("order-table").getElementsByTagName("tbody")[0];
let cOrders;
fetch("http://localhost:5000/api/v1/order", {
method: "GET",
headers: {
'Authorization': `Bearer ${Token}`,
"Content-Type": "application/json",
},
})
.then((response) => response.json())
.then((data) => {
const { orders } = data;
cOrders = orders
orderTableBody.innerHTML = ""; // Clear any existing content

orders.forEach((order) => {
const orderRow = document.createElement("tr");
orderRow.innerHTML = `
  <td>${order._id}</td>
  <td>${order.status}</td>
  <td>$${order.total.toFixed(2)}</td>
  <td class="td-btn">
    <button class="order-btn show-order" data-id="${order._id}">Show Order</button>
    <button class="order-btn update-status" data-id="${order._id}">Update Status</button>
    <button class="order-btn delete-order" data-id="${order._id}" >Delete Order</button>
  </td>
`;
orderTableBody.appendChild(orderRow);

// Add event listeners for the update and delete actions
const updateButton = orderRow.querySelector(".update-status");
updateButton.addEventListener("click", () => {
    const ordersModal = document.querySelector('.modal')
    const modalDiv = document.createElement('div')
    // modalDiv.classList.add = "modal-header"
    ordersModal.innerHTML = `
    <div>
    <span class="close" id="close-modal">&times;</span> <!-- Close button -->
    </div>
    <div>
        <div class="modal-header">
            <h2>Update Order Status</h2>
        </div>

        <div class="modal-body">
            <form id="update-order-status-form"> <!-- Form for updating order status -->
            <div>
                <p>Order ID: ${order._id}</p>
            </div>

            <div class= "list-div">
                <label for="order-status" style="margin-bottom: 0px;">Order Status:</label>
                <select id="order-status" class="order-list" name="orderStatus"> <!-- Dropdown for order status -->
                <option value="" disabled selected hidden>Select a status</option> 
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Paid">Paid</option>
                </select>
            </div>

            <button type="submit">Update Status</button> <!-- Submit button to update the status -->
            </form>
        </div>
    </div>
    `;

    ordersModal.style.display = "block"
    setTimeout(() => {
        ordersModal.style.opacity = 1; // Then, change opacity to trigger transition
    }, 10);
    // ordersModal.classList.add("active");

    function close (){
        ordersModal.style.opacity = 0; // Start fading out
        setTimeout(() => {
            ordersModal.style.display = "none"; // After fade-out, hide the modal
        }, 300);
    }
    document.getElementById("close-modal").addEventListener("click", () => {
        // ordersModal.classList.remove("active"); // Deactivate the modal
        close();
    });
    ordersModal.appendChild(modalDiv)

    const form = document.getElementById("update-order-status-form")
    form.addEventListener("submit",(e)=>{
        e.preventDefault()
        const status = document.getElementById("order-status")
        const Status = status.value
        console.log(Status)
        fetch(`http://localhost:5000/api/v1/order/${updateButton.dataset.id}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${Token}`,
            },
            body: JSON.stringify({ status: Status }),
        })
        .then((response) => response.json())
        .then((updatedOrder) => {
        console.log("Order updated:", updatedOrder);
        // Update the table row to reflect the status change
        // orderRow.querySelector("td:nth-child(2)").textContent = updatedOrder.status;
        fetchAndDisplayOrders()
        close();
        })
        .catch((error) => console.error("Error updating order:", error));
        })
});

const deleteButton = orderRow.querySelector(".delete-order");
deleteButton.addEventListener("click", () => {
  fetch(`http://localhost:5000/api/v1/order/${deleteButton.dataset.id}`, {
    method: "DELETE",
    headers: {
    'Authorization': `Bearer ${Token}`,
    },
  })
    .then((response) => response.json())
    .then(() => {
        // alert("Order deleted: " + deleteButton.dataset.id)
        console.log("Order deleted: ", deleteButton.dataset.id);
      orderTableBody.removeChild(orderRow); // Remove the row from the table
    })
    .catch((error) => console.error("Error deleting order:", error));
});

const showOrdreButton = orderRow.querySelector(".show-order");
showOrdreButton.addEventListener("click", () => {
    const targetId = showOrdreButton.dataset.id; // Assuming this is the ID to find

    // Convert the object to an array of values and use .find() to locate the order with the specified _id
    let cOrder = Object.values(cOrders).find(order => order._id === targetId);

    const ordersModal = document.querySelector('.modal')
    const modalDiv = document.createElement('div')
    // modalDiv.classList.add = "modal-header"
    ordersModal.innerHTML = `
    <div class="modal-header">
        <h2>Order Information</h2>
        <span class="close" id="close-modal">&times;</span> <!-- Close button -->
    </div>

    <div class="modal-body">
        <div class="order-details" id="order-details">
            <!-- Placeholder for order information -->
        </div>

        <table class="order-items" id="order-items">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <!-- Order items will be populated dynamically -->
            </tbody>
        </table>
    </div>

    <div class="modal-footer">
    </div>`
    ordersModal.appendChild(modalDiv)

    const orderDetails = document.getElementById("order-details");
    orderDetails.innerHTML = `
        <p><b>Order ID</b>: ${cOrder._id}</p>
        <p><b>Status</b>: ${cOrder.status}</p>
        <p><b>Total</b>: $${cOrder.total.toFixed(2)}</p>
        <p><b>Ordered on</b>: ${new Date(cOrder.createdAt).toDateString()}</p>
        <p><b>Client Address</b>: ${cOrder.address}</p>
    `;

    const orderItemsTbody = document.getElementById("order-items").querySelector("tbody");
    orderItemsTbody.innerHTML = ""; // Clear previous items
    console.log(cOrder)
    cOrder.orderItems.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td style="padding-left: 30px;">${item.amount}</td>
            <td>$${item.price.toFixed(2)}</td>
        `;
        orderItemsTbody.appendChild(row); // Add item to table
    });

    ordersModal.style.display = "block"
    setTimeout(() => {
        ordersModal.style.opacity = 1; // Then, change opacity to trigger transition
    }, 10);
    // ordersModal.classList.add("active");

    document.getElementById("close-modal").addEventListener("click", () => {
        // ordersModal.classList.remove("active"); // Deactivate the modal
        ordersModal.style.opacity = 0; // Start fading out
        setTimeout(() => {
            ordersModal.style.display = "none"; // After fade-out, hide the modal
        }, 300);
    });
});
// const modal = document.querySelector('.modal')
// modal.style.display = "block"; 
});
})
.catch((error) => console.error("Error fetching orders:", error));
}

// Call the function to fetch and display orders when the DOM is ready
// document.addEventListener("DOMContentLoaded", fetchAndDisplayOrders);

fetchAdminInfo(); // Fetch and display admin info
addNewProduct(); // Set up the "Add New Product" section
deleteProduct(); // Set up the "Delete Products" section
fetchAndDisplayOrders()
// fetchAndUpdateOrders(); // Set up the "Update Order Status" section
downloadOrdersReport(); // Set up the "Download Orders Report" section
getClientAddress()
});

