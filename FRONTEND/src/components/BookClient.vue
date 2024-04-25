<template>
  <div>
    <NavbarUser :loggedInUser="loggedInUser" @openUserProfile="openUserProfile" />
    <div class="container">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <input type="text" v-model="searchQuery" class="form-control" placeholder="Search book">
        </div>
      </div>
    </div>
    <div id="app" class="container">
      <h1 class="title text-center">Danh sách sách</h1>
      <div v-if="loading" class="text-center">Đang tải...</div>
      <div v-else class="row">
        <div v-for="book in filteredBooks" :key="book._id" class="col-md-4">
          <div class="card mb-4">
            <img :src="book.image || 'placeholder.jpg'" alt="Book Image" class="card-img-top">
            <div class="card-body">
              <h2 class="card-title">{{ book.name }}</h2>
              <p class="card-text">Author: {{ book.author }}</p>
              <p class="card-text">Price: {{ book.price }} đ</p>
              <router-link v-if="loggedInUser" :to="'/book-detail/' + book._id" class="btn btn-primary">Chi tiết</router-link>
              <button v-else @click="redirectToLogin" class="btn btn-primary">Đăng nhập hoặc đăng kí để xem chi tiết</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import NavbarUser from './NavbarUser.vue';
import bookService from '@/services/bookservices';
import userService from '@/services/userservices';

export default {
  components: {
    NavbarUser
  },
  data() {
    return {
      loading: false,
      books: [],
      loggedInUser: null,
      searchQuery: ''
    };
  },
  mounted() {
    this.fetchBooks();
  },
  methods: {
    redirectToLogin() {
      alert('You need to login to view book detail')
      this.$router.push('/login');
    },
    async fetchBooks() {
      this.loading = true;
      bookService.fetchBooks()
        .then(data => {
          this.books = data;
          this.loading = false;
        })
        .catch(error => {
          console.error('Error fetching books:', error);
          this.loading = false;
        });
    },
    async openUserProfile() {
      try {
        const userData = await userService.getUserById(this.loggedInUser._id);
        this.showUserProfileModal(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    showUserProfileModal(userData) {
      console.log('Thông tin người dùng:', userData);
    }
  },
  created() {
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
  }, 
  computed: {
    filteredBooks() {
      return this.books.filter(book => {
        return book.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  }
};
</script>

<style scoped>
.title {
  text-align: center;
  color: #333;
  font-size: 2em;
  margin-bottom: 20px;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px 10px 0 0;
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.card-text {
  color: #666;
  margin-bottom: 5px;
}

.btn {
  display: inline-block;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #0056b3;
}
</style>
