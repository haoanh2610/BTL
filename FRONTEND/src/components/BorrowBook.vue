<template>
  <Navbar />
  <div class = "search-container">
    <input type="text" v-model="searchQuery" placeholder="Search borrowed books"> </div>
  <div class="borrowed-book-list">
    <h1>Borrow Book List</h1>
    <div v-if="loading" class="loading-text">Loading...</div>
    <div v-else>
      <table class="borrowed-books-table">
        <thead>
          <tr>
            <th>Book Cover</th>
            <th>Book Name</th>
            <th>User</th>
            <th>Borrow Date</th>
            <th>Return Date</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="borrowedBook in filteredBorrowedBooks" :key="borrowedBook._id">
            <td>
  <img v-if="borrowedBook.book && borrowedBook.book.image" :src="borrowedBook.book.image" alt="Book Cover" style="max-width: 200px; max-height: 200px;">
</td>
            <td>{{ borrowedBook.book?.name }}</td>
            <td>{{ borrowedBook.user.username }}</td>
            <td>{{ formatDate(borrowedBook.borrowDate) }}</td>
            <td>{{ formatDate(borrowedBook.returnDate) }}</td>
            <td>{{ borrowedBook.isActive ? 'Accept' : 'Wait' }}</td>
            <td>
  <div class="action-buttons">
    <button v-if="!borrowedBook.isProcessing && !borrowedBook.isActive" @click="toggleState(borrowedBook)" class="btn btn-primary">Accept</button>
    <button @click="confirmDelete(borrowedBook._id)" class="btn btn-danger">Delete</button>
  </div>
</td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';

export default {
  components: {
    Navbar
  },
  data() {
    return {
      borrowedBooks: [],
      loading: true,
      searchQuery: ''
    };
  },
  methods: {
    async fetchBorrowedBooks() {
      try {
        const response = await axios.get('http://localhost:3500/api/get-all-borrow-book');
        this.borrowedBooks = response.data.data;
        this.loading = false;
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
        this.loading = false;
      }
    },
    async confirmDelete(borrowedBookId) {
      if (confirm('Are you sure you want to delete this borrowed book?')) {
        try {
          await axios.delete(`http://localhost:3500/api/delete-borrow-book/${borrowedBookId}`);
          // Xóa thành công, cập nhật lại danh sách sách được đăng ký mượn
          await this.fetchBorrowedBooks();
        } catch (error) {
          console.error('Error deleting borrowed book:', error);
        }
      }
    },
    async toggleState(borrowedBook) {
  try {
    // Đảo ngược giá trị của trạng thái
    borrowedBook.isActive = !borrowedBook.isActive;
    borrowedBook.isProcessing = true; // Đánh dấu đang xử lý để ẩn nút
    // Gửi yêu cầu cập nhật trạng thái lên API
    await this.updateBorrowBookStatus(borrowedBook);
  } catch (error) {
    console.error('Lỗi khi chuyển đổi trạng thái:', error);
  } finally {
    borrowedBook.isProcessing = false; // Đánh dấu đã hoàn thành xử lý, hiển thị lại nút
  }
},


    async updateBorrowBookStatus(borrowBook) {
      try {
        const response = await axios.put('http://localhost:3500/api/edit-borrow-book', {
          _id: borrowBook._id,
          isActive: borrowBook.isActive
        });
        if (response.status === 200 && response.data && response.data.errCode === 0) {
          console.log('Cập nhật trạng thái isActive thành công.');
        } else {
          console.error('Lỗi khi cập nhật trạng thái isActive:', response.data.message);
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu cập nhật trạng thái isActive:', error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  },
  mounted() {
    this.fetchBorrowedBooks();
  },
  computed: {
    filteredBorrowedBooks() {
      return this.borrowedBooks.filter(borrowedBook => {
        return borrowedBook.book?.name.toLowerCase().includes(this.searchQuery.toLowerCase())||
          borrowedBook.user.username.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  }
};
</script>

<style>
/* Container for borrowed book list */
.borrowed-book-list {
  margin-top: 20px;
  padding: 20px;
}

/* Borrowed book card */
.borrowed-book-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.btn-primary {
  background-color: #4CAF50; /* Green */
  color: white;
}

.btn-primary:hover {
  background-color: #45a049; /* Darker green on hover */
}

.btn-danger {
  background-color: #f44336; /* Red */
  color: white;
}

.btn-danger:hover {
  background-color: #c62828; /* Darker red on hover */
}

/* Loading text */
.loading-text {
  font-style: italic;
  color: #666;
}

/* Table */
.borrowed-books-table {
  width: 100%;
  border-collapse: collapse;
}

/* Table header */
.borrowed-books-table th {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: center; /* Căn giữa tiêu đề cột */
}

/* Table data */
.borrowed-books-table td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: center; /* Căn giữa dữ liệu trong các ô */
}

/* Thêm padding cho button trong bảng */
.borrowed-books-table td button {
  padding: 6px 12px;
}

/* Book cover image */
.borrowed-books-table td img {
  max-width: 200px;
  max-height: 200px;
  display: block;
  margin: auto;
}

/* Button container */
.action-buttons {
  display: flex;
  justify-content: center;
}

/* Buttons */
.action-buttons button {
  margin: 0 5px;
  flex-grow: 1;
}
#app{
  margin: 0 auto;
  max-width: 1000px;
  padding: 20px;
}
</style>
