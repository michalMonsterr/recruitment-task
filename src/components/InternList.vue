<template>
  <div class="container">
    <h2 class="title">User list</h2>
    <div class="content-box">
      <!-- Search and Add User Button -->
      <div class="search-container">
        <input
          type="text"
          v-model="search"
          placeholder="Search for users..."
          class="search-input"
        />
        <i class="fas fa-search search-icon"></i>
        <button class="btn-add" @click="addUser">
          <i class="fas fa-plus plus-icon"></i> Add User
        </button>
      </div>

      <!-- User Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="name-header">Full Name</th>
              <th class="action-header">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedUsers" :key="item.id">
              <td>
                <div class="user-info">
                  <img :src="item.avatar" alt="User Avatar" class="avatar" />
                  {{ item.first_name }} {{ item.last_name }}
                </div>
              </td>
              <td class="actions">
                <div class="action-buttons">
                  <button @click="editUser(item.id)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteUser(item.id)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-container">
      <button
        @click="fetchUsers(page - 1)"
        :disabled="page === 1"
        class="pagination-arrow"
      >
        «
      </button>
      <div class="page-numbers">
        <button
          v-for="p in pageCount"
          :key="p"
          @click="fetchUsers(p)"
          :class="{ active: page === p }"
        >
          {{ p }}
        </button>
      </div>
      <button
        @click="fetchUsers(page + 1)"
        :disabled="page === pageCount"
        class="pagination-arrow"
      >
        »
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

export default {
  name: "InternList",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const users = ref([]); // Store for fetched users
    const search = ref(""); // Search input model
    const page = ref(1); // Current page for pagination
    const itemsPerPage = ref(8); // Items per page for pagination
    const totalUsers = ref(0); // Total number of users from API
    const loading = ref(false); // Loading state

    // Fetches user data from API based on page number
    const fetchUsers = async (pageNumber = 1) => {
      loading.value = true; // Set loading state
      page.value = pageNumber;
      try {
        const response = await axios.get(`https://reqres.in/api/users`, {
          params: {
            page: page.value,
            per_page: itemsPerPage.value,
          },
        });
        const fetchedUsers = response.data.data.map((user) => ({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          avatar: user.avatar,
        }));
        users.value = fetchedUsers; // Update user data
        totalUsers.value = response.data.total; // Update total user count
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        loading.value = false; // Disable loading state
      }
    };

    // Adds a new user passed via route parameters (after creation)
    const addNewUserFromRoute = () => {
      if (route.params.newUser) {
        const newUser = route.params.newUser;
        console.log("Adding new user:", newUser);
        if (newUser.first_name && newUser.last_name && newUser.avatar) {
          users.value.push({
            id: Date.now(), // Temporary unique ID
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            avatar: newUser.avatar,
          });
        } else {
          console.warn("Incomplete data for the new user:", newUser);
        }
      }
    };

    // Load users when the component mounts
    onMounted(() => {
      fetchUsers().then(() => {
        addNewUserFromRoute(); // Add user from route if available
      });
    });

    // Filter and return users based on the search input
    const paginatedUsers = computed(() => {
      const term = search.value.toLowerCase();
      return users.value.filter((user) => {
        const firstName = user.first_name || "";
        const lastName = user.last_name || "";
        return (
          firstName.toLowerCase().includes(term) ||
          lastName.toLowerCase().includes(term)
        );
      });
    });

    // Calculate the total number of pages based on the total users
    const pageCount = computed(() =>
      Math.ceil(totalUsers.value / itemsPerPage.value)
    );

    // Navigate to the Add User page
    const addUser = () => {
      router.push({ name: "AddIntern" });
    };

    // Navigate to the Edit User page with the selected user's ID
    const editUser = (id) => {
      router.push({ name: "EditIntern", params: { id } });
    };

    // Delete user by removing them from the users array
    const deleteUser = (id) => {
      users.value = users.value.filter((user) => user.id !== id);
    };

    return {
      search,
      paginatedUsers,
      page,
      pageCount,
      addUser,
      editUser,
      deleteUser,
      fetchUsers,
    };
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Open Sans", sans-serif;
  background-color: #f5f7fa;
}

.container {
  max-width: 1200px;
  margin: 50px auto;
  padding: 20px;
}

.title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.content-box {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  min-width: 200px;
  max-width: 450px;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px 0 0 5px;
  font-size: 16px;
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #fff;
  border-radius: 0 5px 5px 0;
  color: #aaa;
  cursor: pointer;
}

.plus-icon {
  color: white;
}

.fa-edit,
.fa-trash {
  color: #adb5bb;
}

.fa-edit:hover,
.fa-trash:hover {
  color: #86898c;
}

.btn-add {
  background-color: #1e9067;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 30px;
  cursor: pointer;
  margin-left: auto;
  display: inline-block;
}

.btn-add i {
  margin-right: 5px;
}

.table-container {
  overflow: hidden;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 15px;
  text-align: left;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 10px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-header {
  text-align: right;
}

.name-header {
  text-align: left;
}

.pagination-container {
  display: flex;
  justify-content: flex-start; /* Align pagination to the left */
  align-items: center;
  margin-top: 20px;
  gap: 0; /* Remove gap */
}

.page-numbers button,
.pagination-arrow {
  background-color: #fff;
  border: 1px solid #dee2e6;
  padding: 5px 10px; /* Keep padding for a bit of space */
  margin: 0; /* Remove margin */
  cursor: pointer;
  border-radius: 0; /* Remove rounded corners */
  color: #1e9067;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.page-numbers button.active {
  background-color: #1e9067;
  color: white;
  border-color: #1e9067;
}

.page-numbers button:hover:not(.active),
.pagination-arrow:hover:not([disabled]) {
  background-color: #f1f3f5; /* Slightly darker on hover */
}

.pagination-arrow[disabled] {
  color: #dee2e6;
  cursor: not-allowed;
}

button[disabled] {
  color: #dee2e6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .search-input {
    max-width: 100%;
  }

  .btn-add {
    width: 100%;
    margin-left: 0;
    margin-top: 10px;
  }

  .actions {
    justify-content: center;
  }

  .action-header {
    text-align: center;
  }
}

@media (max-width: 576px) {
  .title {
    font-size: 20px;
  }

  th,
  td {
    padding: 10px;
  }

  .avatar {
    width: 30px;
    height: 30px;
  }
}
</style>
