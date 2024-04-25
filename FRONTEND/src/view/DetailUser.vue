<template>
  <div>
    <NavbarUser :loggedInUser="userData" />
    <div class="container">
      <h1>Thông tin người dùng</h1>
      <div v-if="userData" class="user-info">
        <p><strong>Tên người dùng:</strong> {{ userData.username }}</p>
        <p><strong>Họ tên:</strong> {{ userData.lastName }} {{ userData.firstName }}</p>
        <p><strong>Địa chỉ:</strong> {{ userData.address }}</p>
        <p><strong>Số điện thoại:</strong> {{ userData.phoneNumber }}</p>
        <button class="btn btn-primary" @click="showEditModal = true">Chỉnh sửa thông tin</button>
      </div>
      <div v-else>
        <p>Không tìm thấy thông tin người dùng.</p>
      </div>

      <!-- Modal chỉnh sửa thông tin người dùng -->
      <div class="modal" v-if="showEditModal">
        <div class="modal-content">
  <span class="close" @click="showEditModal = false">&times;</span>
  <h2 class="mb-4">Chỉnh sửa thông tin người dùng</h2>
  <form @submit.prevent="editUser">
    <div class="form-group">
      <label for="lastName" class="form-label">Họ:</label>
      <input type="text" id="lastName" class="form-control" v-model="editedUserData.lastName" required>
    </div>
    <div class="form-group">
      <label for="firstName" class="form-label">Tên:</label>
      <input type="text" id="firstName" class="form-control" v-model="editedUserData.firstName" required>
    </div>
    <div class="form-group">
      <label for="address" class="form-label">Địa chỉ:</label>
      <input type="text" id="address" class="form-control" v-model="editedUserData.address">
    </div>
    <div class="form-group">
      <label for="phoneNumber" class="form-label">Số điện thoại:</label>
      <input type="tel" id="phoneNumber" class="form-control" v-model="editedUserData.phoneNumber" pattern="[0-9]{10}">
    </div>
    <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
  </form>
</div>

      </div>

      <h1>Danh sách sách đã mượn</h1>
      <div v-if="borrowedBooks && borrowedBooks.length > 0" class="borrowed-books">
        <ul class="borrowed-books-list">
          <li v-for="borrowedBook in borrowedBooks" :key="borrowedBook._id" class="borrowed-book">
            <div class="book-info">
              <img :src="borrowedBook.book.image" alt="Book Image" class="book-image">
              <div class="book-details">
                <p><strong>Tên sách:</strong> {{ borrowedBook.book.name }}</p>
                <p><strong>Trạng thái:</strong> <span :style="{ color: borrowedBook.isActive ? 'green' : 'red' }">{{ borrowedBook.isActive ? 'Đã duyệt' : 'Chờ duyệt' }}</span></p>
                <p><strong>Ngày mượn:</strong> {{ formatDate(borrowedBook.borrowDate) }}</p>
                <p><strong>Ngày trả:</strong> {{ formatDate(borrowedBook.returnDate) }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>Người dùng chưa mượn sách nào.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import NavbarUser from '@/components/NavbarUser.vue';
import router from '@/router';
import borrowedBookService from '@/services/borrowbookservices';
import userService from '@/services/userservices';

export default {
  components: {
    NavbarUser
  },
  data() {
    return {
      userData: null,
      borrowedBooks: [],
      showEditModal: false,
      editedUserData: {}
    };
  },
  mounted() {
    const userDataFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    if (userDataFromLocalStorage) {
      this.userData = userDataFromLocalStorage;
      this.fetchBorrowedBooks(userDataFromLocalStorage._id);
      this.editedUserData = { ...userDataFromLocalStorage };
    }
  },
  methods: {
    async fetchBorrowedBooks(userId) {
  borrowedBookService.fetchBorrowedBooks(userId)
    .then(borrowedBooks => {
      // Xử lý danh sách sách đã mượn đã lấy được từ API
      this.borrowedBooks = borrowedBooks;
    })
    .catch(error => {
      // Xử lý lỗi nếu có
      console.error('Error fetching borrowed books:', error);
    });
},
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US');
    },
    async logout() {
      localStorage.removeItem('user');
      await this.$nextTick(); // Chờ Vue cập nhật lại giao diện trước khi chuyển hướng
      router.push('/');
      window.location.reload(); // Làm mới trang để áp dụng trạng thái đã đăng xuất
    },
    editUser() {
  userService.editUser(this.editedUserData)
    .then(data => {
      this.userData = { ...this.editedUserData };
      this.showEditModal = false;
      console.log('showEditModal after closing modal:', this.showEditModal);
    })
    .catch(error => {
      console.error('Error editing user:', error);
    });
}

  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.user-info, .borrowed-books {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.user-info p, .book-details p {
  margin: 10px 0;
}

.borrowed-books-list {
  list-style-type: none;
  padding: 0;
}

.borrowed-book {
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
}

.book-info {
  display: flex;
  align-items: center;
}

.book-image {
  width: 100px;
  height: auto;
  margin-right: 20px;
}

.book-details {
  flex: 1;
}

.book-details p {
  margin: 5px 0;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
