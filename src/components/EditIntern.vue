<template>
  <div class="container">
    <h2 class="title">Edit User</h2>
    <div class="form-photo-wrapper">
      <div class="form-section">
        <!-- Form to update user details -->
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
              />
            </div>
          </div>
          <button type="submit" class="btn-update">Update Details</button>
        </form>
      </div>

      <!-- Section to change user's avatar -->
      <div class="photo-section">
        <div class="avatar">
          <img :src="avatar" alt="User avatar" />
        </div>
        <button class="btn-photo" @click="changePhoto">
          <i class="fa-solid fa-camera"></i> Change Photo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router"; // Import Vue Router for navigation
import axios from "axios";

// Defining reactive references for first name, last name, and avatar
const firstName = ref("");
const lastName = ref("");
const avatar = ref("https://via.placeholder.com/150"); // Default avatar
const router = useRouter(); // Using Vue Router for navigation
const route = useRoute(); // Accessing current route params

const userId = ref(route.params.id); // Extract user ID from route params

// Fetch user data by ID and update local state
const fetchUser = async () => {
  try {
    const response = await axios.get(
      `https://reqres.in/api/users/${userId.value}`
    );
    const user = response.data.data;
    firstName.value = user.first_name;
    lastName.value = user.last_name;
    avatar.value = user.avatar;
  } catch (error) {
    console.error("Error fetching user:", error);
    alert("Failed to fetch user details.");
  }
};

// Function to handle user update
const updateUser = async () => {
  const userData = {
    first_name: firstName.value,
    last_name: lastName.value,
    avatar: avatar.value,
  };

  try {
    const response = await fetch(
      `https://reqres.in/api/users/${route.params.id}`,
      {
        method: "PUT", // HTTP PUT method to update user
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Update failed:", errorData);
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("User updated:", data);
    alert(
      `User ${userData.first_name} ${userData.last_name} updated successfully!`
    );

    // Reset the form and avatar after successful update
    firstName.value = "";
    lastName.value = "";
    avatar.value = "https://via.placeholder.com/150"; // Reset to default avatar

    // Redirect back to the intern list page after successful update
    router.push({
      name: "InternList",
      params: { newUser: userData }, // Pass the updated user to the list page
    });
  } catch (error) {
    console.error("Error updating user:", error);
    alert("Failed to update user.");
  }
};

// Function to change user's avatar by entering a new URL
const changePhoto = () => {
  const newAvatarUrl = prompt("Enter the URL for the avatar:");
  if (newAvatarUrl) {
    avatar.value = newAvatarUrl; // Set new avatar URL
  } else {
    alert("Please enter a valid avatar URL.");
  }
};

// Fetch user details on component mount
onMounted(() => {
  fetchUser();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Open Sans", sans-serif;
  background-color: #f7f7f7;
}

/* Center the container */
.container {
  margin: 50px auto;
  padding: 20px;
  max-width: 1200px;
}

.title {
  text-align: left;
  font-size: 24px;
  margin-bottom: 20px;
}

/* Flexbox layout for the form and photo section */
.form-photo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Ensure both sections have the same height */
  gap: 20px;
}

/* Styling the form and photo sections */
.form-section,
.photo-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.photo-section {
  align-items: center;
  justify-content: center; /* Center the avatar and button vertically */
}

/* Flexbox layout for input fields */
.input-row {
  display: flex;
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

/* Styling for input fields */
.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Update button styling */
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

/* Avatar styling */
.avatar img {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
}

/* Change photo button styling */
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

/* Responsive layout for wider screens */
@media (min-width: 768px) {
  .form-photo-wrapper {
    flex-direction: row;
  }

  .form-section,
  .photo-section {
    flex: 1; /* Ensures both sections take equal space */
    height: auto; /* Allow auto height for flexibility on wider screens */
  }
}
</style>
