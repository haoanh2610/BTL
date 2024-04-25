<template>
  <div class="container">
    <div class="register-container">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required class="form-control">
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required class="form-control">
        </div>
        <div class="form-group">
          <label for="firstName">First Name:</label>
          <input type="text" id="firstName" v-model="firstName" required class="form-control">
        </div>
        <div class="form-group">
          <label for="lastName">Last Name:</label>
          <input type="text" id="lastName" v-model="lastName" required class="form-control">
        </div>
        <div class="form-group">
          <label for="birthday">Birthday:</label>
          <input type="text" id="birthday" v-model="birthday" required class="form-control">
        </div>
        <div class="form-group">
          <label for="gender">Gender:</label>
          <input type="text" id="gender" v-model="gender" required class="form-control">
        </div>
        <div class="form-group">
          <label for="address">Address:</label>
          <input type="text" id="address" v-model="address" required class="form-control">
        </div>
        <div class="form-group">
          <label for="phoneNumber">Phone Number:</label>
          <input type="text" id="phoneNumber" v-model="phoneNumber" required class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Register</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      birthday: '',
      gender: '',
      address: '',
      phoneNumber: '',
      errorMessage: ''
    };
  },
  methods: {
    register() {
      axios.post('http://localhost:3500/api/user-register', {
        username: this.username,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        birthday: this.birthday,   
        gender: this.gender,
        address: this.address,
        phoneNumber: this.phoneNumber,
        role: 'user'
      })
      .then(response => {
        const data = response.data;
        if (data.success) {
          this.$router.push('/login');
        } else {
          this.errorMessage = data.message;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        this.errorMessage = 'An error occurred. Please try again later.';
      });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 0 auto;
}

.register-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  margin-bottom: 5px;
}

input {
  width: 100%;
}

.error-message {
  color: red;
}
</style>
