<template>
  <div>
    <Navbar />
    <div class="user-container">
      <h1>User List</h1>
      <div v-if="loading" class="text-center">Loading...</div>
      <div v-else class="user-list">
        <div class="table">
          <div class="table-header">
            <div class="header__item">Username</div>
            <div class="header__item">Full Name</div>
            <div class="header__item">Birthday</div>
            <div class="header__item">Gender</div>
            <div class="header__item">Address</div>
            <div class="header__item">Phone Number</div>
            <div class="header__item">Role</div>
            <div class="header__item">Action</div> <!-- Add Action column -->
          </div>
          <div class="table-content">
            <div v-for="user in users" :key="user._id" class="table-row">
              <div class="table-data">{{ user.username }}</div>
              <div class="table-data">{{ user.firstName }} {{ user.lastName }}</div>
              <div class="table-data">{{ user.birthday }}</div>
              <div class="table-data">{{ user.gender }}</div>
              <div class="table-data">{{ user.address }}</div>
              <div class="table-data">{{ user.phoneNumber }}</div>
              <div class="table-data">{{ user.role }}</div>
              <div class="table-data">
                <button @click="deleteUser(user._id)" class="btn btn-danger">Delete</button>
                <button @click="openEditModal(user)" class="btn btn-primary">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center">
      <router-link to="/useradd" class="btn btn-primary">Add User</router-link>
    </div>
    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <span class="close-btn" @click="closeEditModal">&times;</span>
        <h3>Edit User</h3>
        <form @submit.prevent="updateUser">
          <div class="form-group">
            <label for="editFirstName">First Name:</label>
            <input type="text" class="form-control" id="editFirstName" v-model="editFormData.firstName">
          </div>
          <div class="form-group">
            <label for="editLastName">Last Name:</label>
            <input type="text" class="form-control" id="editLastName" v-model="editFormData.lastName">
          </div>
          <div class="form-group">
            <label for="editBirthday">Birthday:</label>
            <input type="text" class="form-control" id="editBirthday" v-model="editFormData.birthday">
          </div>
          <div class="form-group">
            <label for="editGender">Gender:</label>
            <input type="text" class="form-control" id="editGender" v-model="editFormData.gender">
          </div>
          <div class="form-group">
            <label for="editAddress">Address:</label>
            <input type="text" class="form-control" id="editAddress" v-model="editFormData.address">
          </div>
          <div class="form-group">
            <label for="editPhoneNumber">Phone number:</label>
            <input type="text" class="form-control" id="editPhoneNumber" v-model="editFormData.phoneNumber">
          </div>
          <div class="form-group">
            <label for="editRole">Role:</label>
            <input type="text" class="form-control" id="editRole" v-model="editFormData.role">
          </div>
          <!-- Add other fields for editing -->
          <div class="save-button-container">
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';
import userService from '@/services/userservices';

export default {
  components: {
    Navbar
  },
  data() {
    return {
      loading: false,
      users: [],
      showEditModal: false,
      editFormData: {
        _id: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        birthday: '',
        gender: '',
        address: '',
        phoneNumber: '',
        role: ''
      }
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      this.loading = true;
      userService.fetchUsers() // Thay thế axios.get bằng userService.fetchUsers()
        .then(users => {
          this.users = users;
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteUser(userId) {
      if (!confirm('Are you sure you want to delete this user?')) {
        return;
      }
      userService.deleteUser(userId) // Thay thế axios.delete bằng userService.deleteUser()
        .then(() => {
          const index = this.users.findIndex(user => user._id === userId);
          if (index !== -1) {
            this.users.splice(index, 1);
          }
          alert('User deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting user:', error);
          alert('Error deleting user. Please try again.');
        });
    },
    openEditModal(user) {
      // Set the editFormData and show the edit modal
      this.editFormData = { ...user };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    updateUser() {
      userService.updateUser(this.editFormData) // Thay thế axios.put bằng userService.updateUser()
        .then(() => {
          console.log('User updated successfully');
          this.showEditModal = false;
          this.fetchUsers();
          alert('User updated successfully!');
        })
        .catch(error => {
          console.error('Error updating user:', error);
          alert('Error updating user. Please try again.');
        });
    }
  }
};
</script>

<style scoped>
/* Styles for User page */
.user-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table-data .btn {
  width: 70px;
  margin-right: 5px;
}

.table-header {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #dadada;
}

.table-row {
  display: flex;
  width: 100%;
  padding: 10px 0px;
}

.table-data,
.header__item {
  flex: 1 1 20%;
  text-align: center;
}

.header__item {
  text-transform: uppercase;
  font-weight: bold;
}

.text-center {
  text-align: center;
}

.add-user-btn {
  margin-top: 20px;
}

.btn-danger {
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-danger:hover {
  background-color: #bb2d3b;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}

/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Modal content */
.modal-content {
  background-color: #fefefe;
  width: 50%;
  max-height: 80%;
  overflow-y: auto;
  border-radius: 10px;
  position: relative;
  padding: 20px;
}

/* Close button */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

/* Form control */
.form-control {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}

/* Form group label */
.form-group label {
  font-weight: bold;
}

/* Save button container */
.save-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* Primary button */
.btn-primary {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
