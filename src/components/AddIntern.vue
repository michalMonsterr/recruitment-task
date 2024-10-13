<template>
  <div class="container">
    <h2 class="title">Add User</h2>
    <div class="form-photo-wrapper">
      <div class="form-section">
        <form @submit.prevent="updateUser">
          <div class="input-row">
            <div class="input-group">
              <label for="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                v-model="firstName"
                placeholder="Enter First Name"
                class="input-field"
                required
              />
            </div>
            <div class="input-group">
              <label for="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                v-model="lastName"
                placeholder="Enter Last Name"
                class="input-field"
                required
              />
            </div>
          </div>
          <button type="submit" class="btn-update">Update Details</button>
        </form>
      </div>

      <div class="photo-section">
        <div class="avatar">
          <img :src="avatar" alt="User avatar" />
        </div>
        <button class="btn-photo" @click="changePhoto">
          <i class="fa-solid fa-camera"></i>
          Change Photo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

// Reactive references for form fields and avatar
const firstName = ref("");
const lastName = ref("");
const avatar = ref("https://via.placeholder.com/150"); // Default avatar

const router = useRouter(); // Access the router instance

// Function to update the user details and send data to the API
const updateUser = async () => {
  if (!firstName.value.trim() || !lastName.value.trim()) {
    alert("First Name and Last Name are required.");
    return;
  }

  const userData = {
    first_name: firstName.value,
    last_name: lastName.value,
    avatar: avatar.value,
  };

  console.log("Updating user with data:", userData); // Log user data

  try {
    const response = await fetch("https://reqres.in/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("User updated:", data);
    alert(
      `User ${userData.first_name} ${userData.last_name} updated successfully!`
    );

    // Reset the form fields
    firstName.value = "";
    lastName.value = "";
    avatar.value = "https://via.placeholder.com/150"; // Reset avatar to default

    // Redirect to the user list with the new user's data
    router.push({
      name: "InternList",
      params: {
        newUser: userData, // Pass the newly created user
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    alert("Failed to update user.");
  }
};

// Function to change the avatar URL based on user input
const changePhoto = () => {
  const newAvatarUrl = prompt("Enter the URL for the avatar:");
  if (newAvatarUrl) {
    avatar.value = newAvatarUrl; // Set avatar to the provided URL
  } else {
    alert("Please enter a valid avatar URL.");
  }
};
</script>

<style scoped>
/* Reset default styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Open Sans", sans-serif;
  background-color: #f7f7f7;
}

/* Centered container */
.container {
  margin: 50px auto;
  padding: 20px;
  max-width: 1200px;
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.form-photo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Ensure both sections have the same height */
  gap: 20px;
}

.form-section,
.photo-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%; /* Set the height to 100% */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Ensures that content is evenly spaced */
}

.photo-section {
  align-items: center;
  justify-content: center; /* Center the avatar and button vertically */
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.input-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 5px;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn-update {
  background-color: #1e9067;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 80px;
}

.btn-update:hover {
  background-color: #218838;
}

.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.avatar img {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.btn-photo {
  margin-top: 10px;
  background-color: white;
  border: 1px solid #ccc;
  color: #6c757d;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 90%;
}

.btn-photo:hover {
  background-color: #f1f1f1;
}

/* Responsive styles */
@media (min-width: 768px) {
  .form-photo-wrapper {
    flex-direction: row;
  }
  .input-row {
    flex-direction: row;
  }

  .form-section,
  .photo-section {
    flex: 1; /* Ensures both sections take equal space */
    height: auto; /* Allow auto height for flexibility on wider screens */
  }
}
</style>
