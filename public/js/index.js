document.addEventListener('DOMContentLoaded', () => {
     // Function to fetch product data from an API or a local source
     function fetchProducts() {
        return fetch('http://localhost:5000/api/v1/product')
            .then(response => response.json())
            .then(product => { 
                const {products} = product 
                return products })
            .catch(error => console.error('Error fetching products:', error));
    }
    
    // Function to display products on the page
    function displayProducts(products) {
        const productContainer = document.querySelector('.product-container');
    
        // Clear existing products
        // productContainer.innerHTML = '';
    
        // Iterate over each product and create HTML elements dynamically
        for (let index = 0; index < 2; index++) {
            products.forEach((product) => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img src="${product.image[0]}" alt="${product.name}">
                    <h4>${product.name}</h4>
                    <p>Description: ${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <button class="productButton btn" onclick="addToCart('${product._id}')" >Add to Cart</button>
                `;
                productContainer.appendChild(productCard);
            });
            // const buttons = document.querySelectorAll('.productButton'); // All buttons
            // console.log(buttons)

        }
        
    }

    fetchProducts().then(products => {
        displayProducts(products);
    })
    .catch(error => {
        console.error('Error fetching or loading the page:', error);
    });
    
       const authToken = localStorage.getItem('Token');
        function loginModal (){
            const modal = document.getElementById("login-modal");
                    const modalOverlay = document.getElementById("modal-overlay");
                    const closeModalButton = document.querySelector(".close-modal");
                    const modalName = document.getElementById("lModal-name");

                    modalName.textContent = "Please, login first!";
                    function openModal(product) {
                        // modal.style.display = "block";
                        modal.style.display = "block"; // Show the modal
                        modalOverlay.style.display = "block";
                        setTimeout(() => {
                            modal.style.opacity = 1;
                              // Smooth fade-in
                            }, 10); 
                    }
                    function closeModal() {
                        // modal.classList.remove("show");
                        modal.style.opacity = 0;
                        setTimeout(() => {
                            modal.style.display = "none"; // Hide the modal
                            modalOverlay.style.display = "none";
                        }, 300); // Match the transition time
                    }
                    openModal()
                    closeModalButton.addEventListener("click", () => {
                        closeModal(); // Call the function to close the modal
                    });
        }
        // console.log(CartItems)
        const contact = document.getElementById("contact")
        contact.addEventListener("click",()=>{
            if(authToken){
                window.location.href = "contact.html"
            }else{
                loginModal()
            }
        })
        async function addToCart(productId) {
            let Product;
            if(!authToken){
                const addToCartButtons = document.querySelector(".productButton");
                    loginModal()
            }else{
                // document.addEventListener("DOMContentLoaded", () => {
                    const modalContent = document.createElement("div")
                    modalContent.classList.add("pModal-content")
                    modalContent.innerHTML = `
                <div class="pModal-header">
                    <span class="pClose-modal bClose">&times;</span> <!-- Close button -->
                </div>
                <div class="pModal-body">
                    <div class="pModal-left">
                        <img id="modal-image" src="" alt="Product Image"> <!-- Product Image -->
                    </div>
                    <div class="pModal-right">
                        <h4 id="modal-name">Product Name</h4> <!-- Product Name -->
                        <p id="modal-description">Product Description</p> <!-- Product Description -->
                        <p id="modal-price">Product Price</p> <!-- Product Price -->

                        <div class="quantity-control"> <!-- Quantity Control -->
                            <button id="minus-btn">-</button>
                            <span id="quantity">1</span>
                            <button id="plus-btn">+</button>
                        </div>
                        <button class="pConfirm-add-to-cart confirmOrLogin">Confirm</button> <!-- Confirm Button -->
                    </div>
                </div>`
                    const modal = document.getElementById("product-modal"); // Modal element
                    const modalOverlay = document.getElementById("modal-overlay");
                    modal.appendChild(modalContent)
                    const closeModalButton = document.querySelector(".pClose-modal"); // Close button
                    const modalImage = document.getElementById("modal-image"); // Product image
                    const modalName = document.getElementById("modal-name"); // Product name
                    const modalDescription = document.getElementById("modal-description"); // Product description
                    const modalPrice = document.getElementById("modal-price"); // Product price
                    const quantitySpan = document.getElementById("quantity"); // Quantity display
                    const plusButton = document.getElementById("plus-btn"); // Plus button
                    const minusButton = document.getElementById("minus-btn"); // Minus button
                    const confirmButton = document.querySelector(".pConfirm-add-to-cart"); // Confirm button
                    const loginButton = document.querySelector(".login"); // Confirm button

                    let currentProductId; // Store the product ID
                    let currentQuantity = 1; // Default quantity

                    // Function to open the modal and populate it with product data
                    function openModal(product) {
                        // modal.style.display = "block";
                        modal.style.display = "block"; // Show the modal
                        modalOverlay.style.display = "block"
                        setTimeout(() => {
                            modal.style.opacity = 1;
                              // Smooth fade-in
                         }, 10); // Small delay to trigger transition

                        currentProductId = product.id; // Store the product ID
                        currentQuantity = 1; // Reset to default quantity

                        // Populate modal with product info
                        modalImage.src = product.image;
                        modalName.textContent = product.name;
                        modalDescription.textContent = product.description;
                        modalPrice.textContent = `Price: $${product.price}`;
                        quantitySpan.textContent = currentQuantity; // Display the default quantity
                    }
                    function closeModal() {
                        // modal.classList.remove("show");
                        modal.style.opacity = 0;
                        setTimeout(() => {
                            modal.style.display = "none"; // Hide the modal
                            modalOverlay.style.display = "none"
                        }, 300); // Match the transition time
                    }

                    // Event to close the modal when clicking the close button or outside the modal
                    closeModalButton.addEventListener("click", () => {
                        closeModal(); // Call the function to close the modal
                        setTimeout(()=>{
                            modal.removeChild(modalContent)
                        },300)
                    });
                    // window.addEventListener("click", (event) => {
                    //     if (event.target === modal) {
                    //         closeModal(); // Close the modal if clicking outside
                    //     }
                    // });

                    

                    // Event for increasing quantity
                    plusButton.addEventListener("click", (event) => {
                        event.preventDefault;
                        currentQuantity++;
                        quantitySpan.textContent = currentQuantity; // Update the displayed quantity
                    });

                    // Event for decreasing quantity
                    minusButton.addEventListener("click", (event) => {
                        event.preventDefault;
                        if (currentQuantity > 1) {
                            currentQuantity--;
                            quantitySpan.textContent = currentQuantity; // Update the displayed quantity
                        }
                    });

                    // Event for confirming add-to-cart
                    confirmButton.addEventListener("click", (event) => {
                        event.preventDefault;
                        let CartItems = JSON.parse(localStorage.getItem('CartItems')) || [];
                        // Code to add the item to the cart with current quantity
                        const q = currentQuantity
                        CartItems = CartItems.filter(item => item.id !== productId); 
                        Product.quantity = currentQuantity
                        // console.log(`Added product ID: ${productId} with quantity: ${quantitySpan.textContent}`);
                        // CartItems = [...CartItems,product];
                        CartItems.push(Product)
                        localStorage.setItem('CartItems', JSON.stringify(CartItems));
                        CartItems = null
                        closeModal(); // Close the modal after confirming
                        setTimeout(()=>{
                            modal.removeChild(modalContent)
                        },300)
                        currentQuantity = 1;
                    });

                    // Example: Opening the modal when a product button is clicked
                    // const productButton = document.querySelector(".productButton"); // Example button ID
                    // Fetch product data from the server (example endpoint)
                        try {
                            const response = await fetch(`http://localhost:5000/api/v1/product/${productId}`);
                            if (response.ok) {
                                const {product} = await response.json();
                                Product= product
                                console.log("Product Data:", Product);
                                openModal(Product); // Open the modal with this product data
                                // Display or process the fetched product data
                            } else {
                                console.error("Failed to fetch product:", response.statusText);
                            }
                        } catch (error) {
                            console.error("Error fetching product:", error);
                        }
            }
        }
});