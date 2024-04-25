<template>
  <NavbarUser :loggedInUser="loggedInUser" @openUserProfile="openUserProfile" />
  <div id="app">
    <h1 class="title">Detail Book</h1>
    <div v-if="loading" class="text-center">Đang tải...</div>
    <div v-else>
      <table class="product-details-table">
        <tr>
          <td>
            <img :src="book.image || 'placeholder.jpg'" alt="Book Image" class="product-image">
          </td>
          <td>
            <h2 class="product-name">Tên sách: {{ book.name }}</h2>
            <p class="product-author">Tác giả: {{ book.author }}</p>
            <p class="product-price">Giá: {{ book.price }} đ</p>
            <p class="product-quantity">Số lượng: {{ book.quantity }}</p>
            <p class="product-publishYear">Năm xuất bản: {{ book.publishYear }}</p>
            <p class="product-publisher">Nhà xuất bản: {{ book?.publisher?.name }}</p>
            <label for="borrowDate">Ngày mượn:</label>
            <input type="date" id="borrowDate" v-model="borrowDate" class="date-input">
            <label for="returnDate">Ngày trả:</label>
            <input type="date" id="returnDate" v-model="returnDate" class="date-input">
            <button @click="registerBorrow" class="btn">Đăng kí mượn</button>
            <p v-if="!isDateValid" class="error-message">Vui lòng nhập ngày mượn ngày trả</p>
            <p v-if="successMessage" class="success-message">{{ successMessage }}</p> <!-- Thêm phần hiển thị thông báo -->
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import NavbarUser from '@/components/NavbarUser.vue';
import axios from 'axios';
import bookService from '@/services/bookservices';
import borrowedBookService from '@/services/borrowbookservices';
import userService from '@/services/userservices';
export default {
  components: {
    NavbarUser
  },
  data() {
    return {
      loading: false,
      book: {},
      borrowDate: '',
      returnDate: '',
      isActive: false,
      isDateValid: true,
      successMessage: '' // Thêm biến successMessage để hiển thị thông báo
    };
  },
  methods: {
  async fetchBookDetail() {
  this.loading = true;
  const bookId = this.$route.params.bookId;
  bookService.getBookDetail(bookId)
    .then(book => {
      this.book = book;
    })
    .catch(error => {
      console.error('Error fetching book detail:', error.message);
    })
    .finally(() => {
      this.loading = false;
    });
},
async registerBorrow() {
  // Kiểm tra xem ngày mượn và ngày trả đã được nhập hay chưa
  if (!this.borrowDate || !this.returnDate) {
    this.isDateValid = false;
    return; // Ngừng thực hiện hàm nếu ngày mượn hoặc ngày trả chưa được nhập
  }

  // Nếu đã nhập đủ ngày mượn và ngày trả, đặt lại isDateValid thành true
  this.isDateValid = true;

  const bookId = this.$route.params.bookId;
  const borrowData = {
    book: bookId,
    user: JSON.parse(localStorage.getItem('user'))._id,
    borrowDate: this.borrowDate,
    returnDate: this.returnDate,
    isActive: this.isActive
  };
  borrowedBookService.registerBorrow(bookId, borrowData)
    .then(result => {
      if (result.success) {
        this.successMessage = result.message;
        console.log('Borrowing book successful');
        // Redirect or show success message
      } else {
        console.error('Error registering borrow:', result.message);
        // Show error message to user
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Show error message to user
    });
},
openUserProfile() {
  // Thực hiện lấy thông tin người dùng từ API và mở modal
  userService.getUserData()
    .then(userData => {
      // Hiển thị modal với thông tin người dùng đã lấy được
      this.showUserProfileModal(userData);
    })
    .catch(error => {
      // Xử lý lỗi nếu có
      console.error('Error opening user profile:', error);
    });
},
    showUserProfileModal(userData) {
      // Hiển thị modal thông tin người dùng với dữ liệu userData
      console.log('Thông tin người dùng:', userData);
      // Thực hiện hiển thị modal thông tin người dùng
    },
    redirectToLogin() {
      // Chuyển hướng đến trang đăng nhập
      this.$router.push('/login');
    }
  },
  created() {
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
  },
  mounted() {
    this.fetchBookDetail();
  },

};
</script>





<style scoped>

#app{
  margin: 0 auto;
  max-width: 800px;
  padding: 20px;

}
.title {
  text-align: center;
  color: #333;
  font-size: 2em;
  margin-bottom: 20px;
}

.text-center {
  text-align: center;
}

.product-details-table {
  width: 100%;
  border-collapse: collapse;
}

.product-details-table td {
  vertical-align: top;
  padding: 10px;
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 8px; /* Bo tròn góc */
  margin-bottom: 20px;
}

.product-name {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.product-author,
.product-price,
.product-quantity,
.product-publishYear,
.product-publisher {
  font-size: 1.2em;
  margin-bottom: 5px;
}

.date-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
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

.error-message {
  color: red;
  margin-top: 5px;
}

/* CSS styles */
.success-message {
  color: green;
  margin-top: 5px;
}
</style>
