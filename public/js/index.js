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
            const loginButton = document.querySelector(".loginB");
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

            loginButton.addEventListener("click", () => {
                window.location.href = `login.html`; // go to login page
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
});