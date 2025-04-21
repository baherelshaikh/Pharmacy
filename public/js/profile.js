document.addEventListener("DOMContentLoaded", async () => {
    const Token = localStorage.getItem('Token'); // Authorization token

    function displayUserInfo(user) {
        console.log(user)
        const userDetails = document.getElementById("user-details");
        let userImage = './uploads/user2.jpg';
        if (user.image) {
        const windowsPath = user.image // Original path
        const normalizedPath = windowsPath.replace(/\\/g, "/"); // Convert to Unix-style path
        userImage = `./${normalizedPath}`||'./uploads/user2.jpg'; // Set user profile image
        }
        userDetails.innerHTML = `
            <img src="${userImage}" alt="${user.name}" class="details-pic"> <!-- User's profile image -->
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Address:</strong> ${user.address}</p>
        `;
    }
    // Function to fetch user information
    async function fetchUserData() {
    // Get the token and userId from local storage
    const userId = localStorage.getItem('userId'); // User ID

    if (!Token || !userId) {
        console.error('Token or userId is missing from local storage');
        return; // Exit if token or userId is not found
    }

    try {
        // Fetch user data from the backend
        const response = await fetch(`http://localhost:5000/api/v1/user/${userId}`, {
        method: 'GET', // Use GET to retrieve data
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`, // Include the token in the Authorization header
        },
        });

        // Check if the response is successful
        if (response.ok) {
        // Convert the response to JSON
        const userData = await response.json();
        // console.log('User data fetched successfully:', userData);
        const {user} = userData
        // Now update the UI with the user data
        displayUserInfo(user); // Display the user information

        } else {
        console.error('Failed to fetch user data:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
    }
    // fetchUserData()
     // Function to display user orders in a table
    function displayUserOrders() {
        const orderList = document.getElementById("order-list");
        let cOrders;
        fetch("http://localhost:5000/api/v1/order/showAllMyOrders", {
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
        orderList.innerHTML = ""; // Clear existing content

        orders.forEach(order => {
            const orderRow = document.createElement("tr"); // Create a new table row
            orderRow.innerHTML = `
                <td>${order._id}</td> <!-- Order ID -->
                <td>${order.status}</td> <!-- Order status -->
                <td>$${order.total.toFixed(2)}</td> <!-- Order total -->
                <td class="td-btn">
                    <button class="order-btn show-order" data-id="${order._id}">Show Order</button>
                    <button class="order-btn delete-order" data-id="${order._id}" >Delete Order</button>
                </td>
            `;
            orderList.appendChild(orderRow); // Add the row to the table
            const showOrdreButton = orderRow.querySelector(".show-order");
            showOrdreButton.addEventListener("click", () => {
                const targetId = showOrdreButton.dataset.id; // Assuming this is the ID to find

                // Convert the object to an array of values and use .find() to locate the order with the specified _id
                let cOrder = Object.values(cOrders).find(order => order._id === targetId);

                const ordersModal = document.querySelector('.modal')
                const modalOverlay = document.getElementById("modal-overlay");
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
                modalOverlay.style.display = "block"
                setTimeout(() => {
                    ordersModal.style.opacity = 1; // Then, change opacity to trigger transition
                }, 10);
                // ordersModal.classList.add("active");

                document.getElementById("close-modal").addEventListener("click", () => {
                    // ordersModal.classList.remove("active"); // Deactivate the modal
                    ordersModal.style.opacity = 0; // Start fading out
                    setTimeout(() => {
                        ordersModal.style.display = "none"; // After fade-out, hide the modal
                        modalOverlay.style.display = "none"
                    }, 300);
                });
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
                        orderList.removeChild(orderRow); // Remove the row from the table
                    })
                    .catch((error) => console.error("Error deleting order:", error));
            });
        });
    })
    }

    // Function to fetch user orders
    async function fetchUserOrders() {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/order/showAllMyOrders`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Token}`,
                }
            }); // API endpoint for orders
            if (response.ok) {
                const {orders} = await response.json(); // Get the list of orders
                console.log(orders)
                displayUserOrders(orders); // Display the orders
            } else {
                console.error("Failed to fetch user orders:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching user orders:", error);
        }
    }
    // Fetch and display user info and orders
    fetchUserData(); // Fetch user info
    fetchUserOrders()
    // await fetchUserOrders(userId); // Fetch user orders
});
