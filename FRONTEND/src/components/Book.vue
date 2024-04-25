<template>
  <Navbar />
  <div id="app">
    <div class="input-group mb-3 search-container">
  <input type="text" class="form-control" v-model="searchQuery" placeholder="Search books by name">
  
</div>


  <div class="book-container">
    <h1>Book List</h1>
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else class="book-list">
      <table class="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name Book</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Publish Year</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in filteredBooks" :key="book._id">
            <td><img :src="book.image" alt="Hình Ảnh" style="max-width: 100px; max-height:100px" @click="openModal(book.img)"></td>
            <td>{{ book.name }}</td>
            <td>{{ book.price }}</td>
            <td>{{ book.quantity }}</td>
            <td>{{ book.publishYear }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book?.publisher?.name }}</td>
            <td class="actions">
              <button @click="editBook(book)" class="btn btn-primary">Edit</button>
              <button @click="deleteBook(book)" class="btn btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="$router.push('/bookadd')" class="add-book-btn">New</button>
    </div>
  </div>
    <!-- Modal overlay -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content">
        <span class="close-btn" @click="closeModal">&times;</span>
        <img :src="selectedImage" alt="Hình Ảnh" class="modal-image">
      </div>
    </div>
    <!-- Edit book modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <span class="close-btn" @click="closeEditModal">&times;</span>
        <h3 style="text-align: center;">{{ modalTitle }}</h3>
        <form @submit.prevent="updateBook">
          <div class="form-group">
            <label for="editName">Name Book:</label>
            <input type="text" class="form-control" id="editName" v-model="saveBook.name" @change="updateBookData">
          </div>
          <div class="form-group">
            <label for="editPrice">Price:</label>
            <input type="number" class="form-control" id="editPrice" v-model="saveBook.price" @change="updateBookData">
          </div>
          <div class="form-group">
            <label for="editQuantity">Quantity:</label>
            <input type="number" class="form-control" id="editQuantity" v-model="saveBook.quantity" @change="updateBookData">
          </div>
          <div class="form-group">
            <label for="editPublishYear">Publish Year:</label>
            <input type="number" class="form-control" id="editPublishYear" v-model="saveBook.publishYear" @change="updateBookData">
          </div>
          <div class="form-group">
            <label for="editAuthor">Author:</label>
            <input type="text" class="form-control" id="editAuthor" v-model="saveBook.author" @change="updateBookData">
          </div>
          <div class="form-group">
            <label for="editPublisher">Publisher:</label>
            <select class="form-control" id="editPublisher" v-model="saveBook.publisher" @change="updateBookData">
              <option v-for="publisher in publishers" :value="publisher._id">{{ publisher.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editImage">Link Image:</label>
            <input type="text" class="form-control" id="editImage" v-model="saveBook.img" @change="updateBookData">
          </div>
          <div class="save-button-container">
            <button type="submit" class="btn btn-primary" style="justify-content:center">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import bookService from '@/services/bookservices';
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      loading: false,
      books: [],
      showModal: false,
      selectedImage: '',
      showEditModal: false,
      modalTitle: '',
      saveBook: {},
      publishers: [],
      searchQuery: '',
    };
  },
  mounted() {
    this.fetchBooks();
    this.getAllPublishers();
  },
  computed: {
  filteredBooks() {
    return this.books.filter(book => {
      return book.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
  },
},

  methods: {
    getAllPublishers() {
      bookService.getAllPublishers()
        .then(publishers => {
          this.publishers = publishers;
        })
        .catch(error => {
          console.error('Lỗi khi lấy dữ liệu nhà xuất bản từ API:', error);
        });
    },
    async fetchBooks() {
      this.loading = true;
      try {
        this.books = await bookService.fetchBooks();
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sách từ API:', error);
      } finally {
        this.loading = false;
      }
    },
    addNewBook() {
    },
    editBook(book) {
      this.saveBook = { ...book };
      this.modalTitle = "Edit Book";
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },

    updateBookData() {
      // Không cần thực hiện gì cả, vì v-model đã tự động cập nhật saveBook
    },
    async updateBook() {
      try {
        await bookService.updateBook(this.saveBook);
        console.log("Book updated successfully");
        this.showEditModal = false;
        this.fetchBooks();
      } catch (error) {
        console.error("Lỗi khi cập nhật sách:", error);
      }
    },

    async deleteBook(bookToDelete) {
      // Hiển thị xác nhận trước khi xóa
      if (!confirm('Bạn có chắc chắn muốn xóa cuốn sách này không?')) {
        return;
      }
      try {
        await bookService.deleteBook(bookToDelete._id);
        // Nếu xóa thành công, xóa sách khỏi mảng books
        const index = this.books.findIndex(book => book._id === bookToDelete._id);
        if (index !== -1) {
          this.books.splice(index, 1);
        }
        alert('Xóa sách thành công!');
      } catch (error) {
        // Hiển thị thông báo lỗi nếu xóa không thành công
        console.error('Lỗi khi xóa sách:', error);
        alert('Không thể xóa sách. Vui lòng thử lại.');
      }
    },
    openModal(imageSrc) {
      this.selectedImage = imageSrc;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  },
  created() {
  // Lấy thông tin người dùng từ localStorage
  this.loggedInUser = JSON.parse(localStorage.getItem('user'));
  // Kiểm tra vai trò của người dùng
  if (this.loggedInUser && this.loggedInUser.role === 'user') {
    // Nếu là user, chuyển hướng đến trang chính hoặc hiển thị thông báo
    this.$router.push('/bookclient'); // Chuyển hướng đến trang chính
    // Hoặc hiển thị thông báo
    // alert('Bạn không có quyền truy cập vào trang quản lý sách.');
  }
}

};
</script>

<style scoped>
/* Container for the book list */
.book-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Style for the book list */
.book-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Table */
.table {
  width: 100%;
  border-collapse: collapse;
}

/* Table header */
.table th {
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  border-bottom: 1px solid #dadada;
}

/* Table data */
.table td {
  text-align: center;
}

/* Add book button */
.add-book-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #1da950;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-book-btn:hover {
  background-color: #1a8f45;
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
  height: 70%;
  border-radius: 10px;
  position: relative;
}

/* Close button */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

/* Modal image */
.modal-image {
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
}

/* Form control */
.form-control {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}

/* Form group */
.form-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

/* Form group label */
.form-group label {
  margin-bottom: 5px;
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

/* Action buttons container */
.actions {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

/* Edit and delete buttons */
.actions button {
  padding: 8px 16px;
  margin: 0 4px;
}
#app {
  font-family: Arial, sans-serif;
  margin: auto auto;
  max-width: 800px;
  padding: 20px;
}
/* Bootstrap styling for search button */
.search-container .btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

</style>
