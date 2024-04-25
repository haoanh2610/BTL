<template>
  <div id="app">
    <h1>Books Management</h1>
    <div class="navbar">
      <!-- Các liên kết đến các trang khác -->
      <router-link to="/home" class="nav-link">Home</router-link>
      <router-link to="/books" class="nav-link">Books</router-link>
      <router-link to="/borrowbook" class="nav-link">Borrow Book</router-link>
      <router-link to="/publishers" class="nav-link">Publishers</router-link>
      <router-link to="/user" class="nav-link">Users</router-link>
      <router-link to="/login" class="nav-link" @click="logout">Logout</router-link>
      <span v-if="loggedInUser" class="nav-link">Logged in as: {{ loggedInUser.username }}</span>
      <!-- Thêm điều kiện để hiển thị thông báo hoặc nút chuyển hướng -->
      <div v-if="loggedInUser && loggedInUser.role === 'user'">
        <p>Bạn không được phép truy cập vào trang này!</p>
        <!-- Hoặc hiển thị nút chuyển hướng -->
        <router-link to="/bookclient">Trang chủ</router-link>
      </div>
    </div>      
  </div>
</template>


<script>
export default {
  data() {
    return {
      loggedInUser: null
    };
  },
  created() {
    // Lấy thông tin người dùng từ localStorage
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
  },
  methods: {
    logout() {
      // Xóa người dùng khỏi localStorage
      localStorage.removeItem('user');
      // Đặt loggedInUser về null để ẩn thông tin người dùng
      this.loggedInUser = null;
    }
  }
};
</script>


<style>
#app {
  font-family: Arial, sans-serif;
  margin: auto auto;
  max-width: 900px;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.navbar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.nav-link {
  text-decoration: none;
  color: #333;
  padding: 8px 16px;
  border: 1px solid #333;
  border-radius: 5px;
  transition: all 0.3s ease;
  margin: 0 5px; /* Thêm margin giữa các nav-link */
}

.nav-link:hover {
  background-color: #333;
  color: #fff;
}
</style>
