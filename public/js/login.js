document.addEventListener('DOMContentLoaded', () => {
            async function loginUser(phone, password) {
            try {
                // Create the login payload
                const loginPayload = {
                phone: phone,
                password: password,
                };

                // Send a POST request to the login API endpoint
                const response = await fetch('http://localhost:5000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginPayload),
                });

                if (!response.ok) {
                // Handle unsuccessful login
                throw new Error('Login failed: ' + response.statusText);
                }

                // Parse the JSON response to get user info and token
                const { Token, user } = await response.json();

                // Store the token in local storage or a cookie for session persistence
                localStorage.setItem('Token', Token);
                localStorage.setItem('userId', user.userId);

                // Redirect to the home page or another page
                // window.location.href = '/index.html'; // Adjust the target URL as needed
                if(user.role === "user"){
                    window.location.href = `index.html`;
                }else{
                    window.location.href = `admin.html`;
                }
                // You can also pass user data via query parameters or global state management
                console.log('User logged in successfully:', user);
            } catch (error) {
                console.error('Error during login:', error);
                alert('Login failed. Please check your credentials and try again.');
            }
            }

            document.getElementById('login-form').addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission behavior

            // Get username and password from form fields
            const phone = document.getElementById('Phone-Number').value;
            const password = document.getElementById('password').value;

            // Call the loginUser function to authenticate the user
            loginUser(phone, password);
            });

        });