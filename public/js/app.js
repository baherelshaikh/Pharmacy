    // Fetch products and display them when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // let userRole ;
    const authToken = localStorage.getItem('Token');

    // Function to update the UI with user information
    function updateUserUI(user) {
    // Assume userData contains user-specific information like name, email, profile picture, etc.
    const userPic = document.querySelector('.user-pic');
    
    if (userPic) {
      const windowsPath = user.image // Original path
      const normalizedPath = windowsPath.replace(/\\/g, "/"); // Convert to Unix-style path
      userPic.src = `./${normalizedPath}`||'./uploads/user2.jpg'; // Set user profile image
    }
    }
    // let userRole ;
    // Function to fetch user data from the backend using a token and userId from local storage
    async function fetchUserData() {
    // Get the token and userId from local storage
    const token = localStorage.getItem('Token'); // Authorization token
    const userId = localStorage.getItem('userId'); // User ID
    let userRole = null;
    if (!token || !userId) {
        console.error('Token or userId is missing from local storage');
        displayIcons(userRole);
        return; // Exit if token or userId is not found
    }

    try {
        // Fetch user data from the backend
        const response = await fetch(`http://localhost:5000/api/v1/user/${userId}`, {
        method: 'GET', // Use GET to retrieve data
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
        });

        // Check if the response is successful
        if (response.ok) {
        // Convert the response to JSON
        const fUser = await response.json();
        userRole = fUser.user.role
        console.log(userRole)
        // console.log('User data fetched successfully:', userData);

        // Now update the UI with the user data
        updateUserUI(fUser.user); // Function to update the UI with user info
        displayIcons(userRole);


        } else {
        console.error('Failed to fetch user data:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
    }

    function displayIcons(userRole){
        const userIcons = document.getElementById('userIcons')
        // const loginLink = document.querySelector('.user-nav a[href="login.html"]'); // The login link
        const userTools = document.querySelector('.user-tools')
        // const adminLink = document.getElementById('admin')
        const contact = document.getElementById("contact")
        const myCart = document.getElementById("myCart")
        const ul = document.querySelector(".main-nav")
        const userUl = document.querySelector(".user-nav")
        const userPic =document.querySelector(".user-pic")
        // const myCart = document.querySelector('.main-nav a[href="cart.html"]'); // The login link

            if (authToken) {
                // Hide the login link if the user is logged in
                console.log(userRole)
                if (userRole === "admin") {
                    const admin = document.createElement("li")
                    admin.innerHTML = `<a href="admin.html" id="admin" class="admin">Admin</a>`
                    ul.appendChild(admin)

                    // const logout = document.createElement("li")
                    // logout.innerHTML = `<a id="logout-link" href="">Logout</a>`
                    // ul.appendChild(logout)
                    if(userPic && contact && myCart){
                        userPic.classList.add('hidden')
                        contact.classList.add('hidden')
                        myCart.classList.add('hidden')
                    }
                    if(userIcons)
                    userIcons.children[0].classList.add("hidden");

                    return;
                    
                    // adminLink.style.display = 'block'
                    // userTools.style.display = 'none'
                }else{
                    // const contact = document.createElement("li")
                    // contact.innerHTML = `<a href="contact.html" id="contact">Contact Dr</a>                   `
                    
                    // const cart = document.createElement("li")
                    // cart.innerHTML = `<a href="cart.html" id="myCart">My Cart</a>`
                    
                    if(!window.location.pathname === "/contact.html")
                        ul.appendChild(contact)

                    if(!window.location.pathname === "/cart.html")
                        ul.appendChild(cart)

                    return;
                    // loginLink.style.display = 'none';
                    // adminLink.classList.add('hidden')
                }
            }
            // If not logged in, hide the user-specific navigation
            // adminLink.classList.add('hidden')
            // console.log(userIcons)
            if(!userRole){
                if (userIcons) {
                    const login = document.createElement("li")
                    login.innerHTML = `<a href="login.html" class="login">Login</a>`

                    userUl.appendChild(login)
                    userIcons.children[0].classList.add("hidden");
                    userIcons.children[1].classList.add("hidden");
                }
            }
    }   

    function logout (){
        const logoutLink = document.getElementById('logout-link');

    if (logoutLink) {
        logoutLink.addEventListener('click', async (event) => {
            event.preventDefault(); // Prevent the default link behavior

            try {
                const response = await fetch('http://localhost:5000/api/v1/auth/logout', {
                    method: 'GET', // Sending a POST request to the logout endpoint
                    headers: {
                        'Content-Type': 'application/json', // If required by the backend
                    },
                });

                if (response.ok) {
                    // Clear any authentication tokens or session data
                    localStorage.removeItem('Token'); // Remove the authentication token
                    localStorage.removeItem('userId'); // Remove the user data

                    // Redirect the user to the login page
                    window.location.href = 'index.html';
                } else {
                    console.error('Logout failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during logout:', error);
            }
        });
        }
    }

    const contact = document.getElementById("no-home-contact")
        if(contact){
            contact.addEventListener("click",()=>{
                if(authToken){
                    window.location.href = "contact.html"
                }else{
                    alert("Please login first!")
                }
            })
        }
    

    fetchUserData();
    logout()

});
