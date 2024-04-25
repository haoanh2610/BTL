<template>
  <Navbar class="navbar">
    <h1>Borrow Book</h1>
  </Navbar>
  <div class="container">
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required class="form-control">
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
      <button @click="$router.push('/signup')" class="btn btn-link">Register</button>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      role: '',
      errorMessage: ''
    };
  },
  methods: {
    login() {
      axios.post('http://localhost:3500/api/user-login', {
        username: this.username,
        password: this.password
      })
      .then(response => {
        const data = response.data;
        if (data.user && data.user._id) {
          localStorage.setItem('user', JSON.stringify(data.user));
          if (data.user.role === 'Admin') {
            this.$router.push('/home');
          } else if (data.user.role === 'User') {
            this.$router.push('/');
          } else {
            // Handle unknown role or other cases
          }
        } else {
          this.errorMessage = 'Invalid username or password. Please try again.';
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
.login-container {
  max-width: 400px;
  margin: 0 auto;
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

.btn {
  width: 100%;
}

.error-message {
  color: red;
}

.navbar {
  margin-bottom: 20px;
  font-size: larger;
}
</style>
