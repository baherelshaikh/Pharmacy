document.addEventListener("DOMContentLoaded", () => {
    let cartItems = JSON.parse(localStorage.getItem('CartItems')) || []; // Get cart items from local storage
    const cartContent = document.getElementById("cart-content"); // Element for cart items
    const totalPriceEl = document.getElementById("total-price"); // Element for total price
    const purchaseBtn = document.getElementById("purchase-btn"); // Purchase button

    // Function to update total price
    function updateTotalPrice() {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price * item.quantity; // Calculate total price
        });
        totalPriceEl.textContent = total.toFixed(2); // Display total price
    }

    // Function to display cart contents
    function displayCart() {
        cartContent.innerHTML = ""; // Clear existing content
        cartItems.forEach(item => {
            const cartItem = document.createElement("div"); // Create a cart item div
            cartItem.classList.add("cart-item"); // Add a class for styling

            // HTML for the cart item
            cartItem.innerHTML = `
                <div class="cart-item-left"> 
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image"> <!-- Product image -->
                    <div class="cart-item-details"> <!-- Product details -->
                        <p class="cart-item-name">${item.name}</p> <!-- Product name -->
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p> <!-- Product price -->
                    </div>
                </div>
                <div class="cart-item-right"> <!-- Quantity control -->
                    <div class="quantity-control">
                        <button class="decrease-quantity">-</button> <!-- Decrease quantity -->
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input"> <!-- Quantity input -->
                        <button class="increase-quantity">+</button> <!-- Increase quantity -->
                    </div>
                    <button class="remove-item" id= "${item._id}" >Remove</button> <!-- Remove button -->
                </div>
            `;

            cartContent.appendChild(cartItem); // Append the cart item to the content

            // Event listeners for quantity control
            const quantityInput = cartItem.querySelector(".quantity-input");
            quantityInput.addEventListener("change", event => {
                const newQuantity = parseInt(event.target.value, 10);
                if (newQuantity > 0) {
                    item.quantity = newQuantity; // Update the quantity
                    updateTotalPrice(); // Update the total price
                }
            });

            const decreaseButton = cartItem.querySelector(".decrease-quantity");
            decreaseButton.addEventListener("click",()=>{
                if(quantityInput.value > 1)
                    quantityInput.value--;
                    item.quantity--;
                    updateTotalPrice();
            })
            const increaseButton = cartItem.querySelector(".increase-quantity");
            increaseButton.addEventListener("click",()=>{
                    quantityInput.value++;
                    item.quantity++;
                    updateTotalPrice();
            })
            // Event listener for remove button
            const removeButton = cartItem.querySelector(".remove-item");
            removeButton.addEventListener("click", () => {
                cartItems = cartItems.filter(item => item._id !== removeButton.id)
                console.log(cartItems)
                // cartItems.splice(index, 1); // Remove the item from the array
                localStorage.setItem('CartItems', JSON.stringify(cartItems)); // Update local storage
                displayCart(); // Refresh the cart content
                updateTotalPrice(); // Update the total price
            });
        });

        updateTotalPrice(); // Update the total price
    }

    displayCart(); // Display the cart items initially

    // Event listener for the purchase button
    purchaseBtn.addEventListener("click", async () => {
        const authToken = localStorage.getItem("Token")
        if(!authToken){

        }else{
            window.location.href = `payment.html`;
        }
    });
});