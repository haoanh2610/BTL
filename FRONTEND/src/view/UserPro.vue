<template>
    <div>
      <h1 class="title">Thông tin người dùng</h1>
      <div v-if="loading" class="text-center">Đang tải...</div>
      <div v-else>
        <div class="user-details">
          <p><strong>Tên người dùng:</strong> {{ user.name }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Địa chỉ:</strong> {{ user.address }}</p>
          <!-- Thêm các thông tin khác của người dùng tại đây -->
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        loading: false,
        user: null
      };
    },
    mounted() {
      this.fetchUserData();
    },
    methods: {
      fetchUserData() {
        this.loading = true;
        const userId = this.$route.params.userId; // Lấy userId từ route params
        axios.get(`http://localhost:3500/api/get-detail-user-by-id/${userId}`)
          .then(response => {
            const data = response.data;
            if (data.errCode === 0) {
              this.user = data.data;
            } else {
              console.error('Error fetching user data:', data.errMessage);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  };
  </script>
  
  <style scoped>
  /* CSS styles */
  .title {
    text-align: center;
    color: #333;
    font-size: 2em;
    margin-bottom: 20px;
  }
  
  .user-details {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  </style>
  