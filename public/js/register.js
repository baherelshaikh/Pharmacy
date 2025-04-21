document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registration-form");
  const profileImageInput = document.getElementById("profile-image");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent the default form submission
      let file;
    //   const formData = new FormData(); // Use FormData to include files
      const userData = {};
            const formData = new FormData(form);
            formData.forEach((value, key) => {
                userData[key] = value;
            });

      // Check if an image was selected
      if (profileImageInput.files.length > 0) {
        file = profileImageInput.files[0];

        // Optional: Validate file size (e.g., max 2MB)
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSizeInBytes) {
          alert("File size must be less than 2MB.");
          profileImageInput.value = ""; // Clear the selected file
          return; // Exit early if file size is too large
        }

        // Append the image to the form data *********
        userData['image'] = file.name; // Include the image URL
        // formData.append("image", `${file.name}`);
      }

      try {
        const response = await fetch("http://localhost:5000/api/v1/auth/register", {
          method: "POST",
          headers: {
                        'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData), // Send the data as JSON
        });

        if (response.ok) {
          // const { user } = await response.json();
          // console.log("Registration successful:", user);

            try {
            const formData = new FormData();
            formData.append("image", file); // Add the file to the FormData

            const response = await fetch("http://localhost:5000/api/v1/user/useruploadImage", {
                method: "POST",
                body: formData, // Upload the image to the server
            });

            if (response.ok) {
                // const { userImage } = await response.json(); // Get the image URL from the response
                // uploadedImageUrl = userImage; // Store the image URL
                  window.location.href = "index.html"; // Example redirect after registration
                  
                } else {
                console.error("Image upload failed:", response.statusText); // Handle error
                return; // Exit if image upload fails
            }
            } catch (error) {
            console.error("Error uploading image:", error); // Log the error
            return; // Exit to prevent form submission
            }
            const { Token, user } = await response.json();
                // Store the token in local storage or a cookie for session persistence
                localStorage.setItem('Token', Token);
                localStorage.setItem('userId', user.userId);
        }else {
        console.error("Registration failed:", response.statusText);
        }
          // Redirect or handle successful registration
        //   window.location.href = "index.html"; // Example redirect after registration
      } catch (error) {
        console.error("An error occurred during registration:", error);
      }
    });
  }
});