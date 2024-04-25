<template>
  <div>
    <h1>Add New User</h1>
    <form @submit.prevent="addUser" class="needs-validation" novalidate>
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" class="form-control" id="username" v-model="newUser.username" required>
        <div class="invalid-feedback">Please enter a username.</div>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" class="form-control" id="password" v-model="newUser.password" required>
        <div class="invalid-feedback">Please enter a password.</div>
      </div>
      <div class="form-group">
        <label for="firstName">First Name:</label>
        <input type="text" class="form-control" id="firstName" v-model="newUser.firstName" required>
        <div class="invalid-feedback">Please enter your first name.</div>
      </div>
      <div class="form-group">
        <label for="lastName">Last Name:</label>
        <input type="text" class="form-control" id="lastName" v-model="newUser.lastName" required>
        <div class="invalid-feedback">Please enter your last name.</div>
      </div>
      <div class="form-group">
        <label for="birthday">Birthday:</label>
        <input type="date" class="form-control" id="birthday" v-model="newUser.birthday" required>
        <div class="invalid-feedback">Please enter your birthday.</div>
      </div>
      <div class="form-group">
        <label for="gender">Gender:</label>
        <input type="text" class="form-control" id="gender" v-model="newUser.gender" required>
        <div class="invalid-feedback">Please enter your gender.</div>
      </div>
      <div class="form-group">
        <label for="address">Address:</label>
        <input type="text" class="form-control" id="address" v-model="newUser.address" required>
        <div class="invalid-feedback">Please enter your address.</div>
      </div>
      <div class="form-group">
        <label for="phoneNumber">Phone Number:</label>
        <input type="text" class="form-control" id="phoneNumber" v-model="newUser.phoneNumber" required>
        <div class="invalid-feedback">Please enter your phone number.</div>
      </div>
      <div class="form-group">
        <label for="role">Role:</label>
        <input type="text" class="form-control" id="role" v-model="newUser.role" required>
        <div class="invalid-feedback">Please enter a role.</div>
      </div>
      <button type="submit" class="btn btn-primary">Add User</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newUser: {
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
  methods: {
    addUser() {
      axios.post('http://localhost:3500/api/create-user', this.newUser)
        .then(response => {
          console.log('User added successfully:', response.data);
          alert('User added successfully!');
          // Reset the form fields after successful submission
          this.newUser = {
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            birthday: '',
            gender: '',
            address: '',
            phoneNumber: '',
            role: ''
          };
        })
        .catch(error => {
          console.error('Error adding user:', error);
          alert('Error adding user. Please try again.');
        });
    }
  }
};
</script>

<style scoped>
.invalid-feedback {
  color: red;
}
</style>
