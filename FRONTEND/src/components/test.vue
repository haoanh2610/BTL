<template>
    <NavbarDashboard />
    <div id="app">
      <h1>Danh sách những quyển sách</h1>
      <button class="btn btn-success" @click="addNewBook">Thêm mới sách</button>
      <table class="table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Năm xuất bản</th>
            <th>Nhà xuất bản</th>
            <th>Tác giả</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book._id">
            <td>
              <img
                :src="book.image"
                alt="Book Image"
                style="max-width: 80px; max-height: 80px"
              />
            </td>
            <td style="max-width: 280px">{{ book.name }}</td>
            <td>{{ book.price }}</td>
            <td>{{ book.quantity }}</td>
            <td>{{ book.publishYear }}</td>
            <td style="max-width: 280px">{{ book?.publisher?.name }}</td>
            <td>{{ book.author }}</td>
            <td>
              <button class="btn btn-primary" @click="editBook(book)">
                Edit
              </button>
              <button class="btn btn-danger" @click="deleteBook(book._id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Modal for editing book -->
      <div v-if="showEditModal" class="modal-overlay">
        <div class="modal slide-in-left">
          <button class="modal-close" @click="closeModal">&times;</button>
          <h2>{{ modalTitle }}</h2>
          <!-- Form for editing book -->
          <form @submit.prevent="updateBook">
            <div class="form-group">
              <label for="editName">Tên:</label>
              <input
                type="text"
                class="form-control"
                id="editName"
                v-model="editBookData.name"
              />
            </div>
            <div class="form-group">
              <label for="editPrice">Giá:</label>
              <input
                type="number"
                class="form-control"
                id="editPrice"
                v-model="editBookData.price"
              />
            </div>
            <div class="form-group">
              <label for="editQuantity">Số lượng:</label>
              <input
                type="number"
                class="form-control"
                id="editQuantity"
                v-model="editBookData.quantity"
              />
            </div>
            <div class="form-group">
              <label for="editPublishYear">Năm xuất bản:</label>
              <input
                type="number"
                class="form-control"
                id="editPublishYear"
                v-model="editBookData.publishYear"
              />
            </div>
            <div class="form-group">
              <label for="editPublisher">Nhà xuất bản:</label>
              <select
                class="form-control"
                id="editPublisher"
                v-model="editBookData.publisher"
              >
                <option
                  v-for="publisher in publishers"
                  :key="publisher._id"
                  :value="publisher"
                >
                  {{ publisher.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="editAuthor">Tác giả:</label>
              <input
                type="text"
                class="form-control"
                id="editAuthor"
                v-model="editBookData.author"
              />
            </div>
            <div class="form-group">
              <label for="editImage">Đường link ảnh:</label>
              <input
                type="text"
                class="form-control"
                id="editImage"
                v-model="editBookData.image"
              />
            </div>
            <button type="submit" class="btn btn-primary">Lưu</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import NavbarDashboard from "@/components/Navbar-dashboard.vue";
  
  export default {
    name: "App",
    components: {
      NavbarDashboard,
    },
    name: "App",
    data() {
      return {
        books: [],
        showEditModal: false,
        editBookData: {},
        isAddingNewBook: false,
        publishers: [],
      };
    },
    mounted() {
      this.fetchBooks();
      this.fetchPublishers();
    },
    methods: {
      fetchPublishers() {
        axios
          .get("http://localhost:3500/api/get-all-publisher")
          .then((response) => {
            this.publishers = response.data.data;
          })
          .catch((error) => {
            console.error("There was an error fetching publishers!", error);
          });
      },
      fetchBooks() {
        axios
          .get("http://localhost:3500/api/get-all-book")
          .then((response) => {
            this.books = response.data.data;
          })
          .catch((error) => {
            console.error("There was an error!", error);
          });
      },
      addNewBook() {
        // Đặt dữ liệu mặc định cho modal thêm sách mới
        this.editBookData = {
          name: "",
          price: null,
          quantity: null,
          publishYear: null,
          publisher: {},
          author: "",
          image: "",
        };
        this.modalTitle = "Thêm mới sách";
        this.isAddingNewBook = true;
        // Hiển thị modal
        this.showEditModal = true;
      },
      editBook(book) {
        this.editBookData = { ...book };
        this.editBookData.publisher = this.publishers.find(
          (publisher) => publisher._id === book.publisher._id
        );
        this.modalTitle = "Chỉnh sửa sách";
        this.isAddingNewBook = false;
        this.showEditModal = true;
      },
      deleteBook(bookId) {
        if (confirm("Are you sure you want to delete this book?")) {
          axios
            .delete(http://localhost:3500/api/delete-book/${bookId})
            .then((response) => {
              console.log("Book deleted successfully:", response.data);
              // Cập nhật lại danh sách sách sau khi xóa
              this.fetchBooks();
            })
            .catch((error) => {
              console.error("There was an error!", error);
            });
        }
      },
      closeModal() {
        this.showEditModal = false;
      },
      updateBook() {
        if (this.editBookData._id) {
          // Nếu _id tồn tại, đây là việc cập nhật sách đã tồn tại
          axios
            .put("http://localhost:3500/api/edit-book", this.editBookData)
            .then((response) => {
              console.log("Edit sách thành công!");
              this.showEditModal = false;
              this.fetchBooks();
            })
            .catch((error) => {
              console.error("There was an error!", error);
            });
        } else {
          // Nếu không, đây là việc thêm sách mới
          axios
            .post("http://localhost:3500/api/create-book", this.editBookData)
            .then((response) => {
              console.log("Book created successfully:", response.data);
              this.showEditModal = false;
              this.fetchBooks();
            })
            .catch((error) => {
              console.error("There was an error!", error);
            });
        }
      },
    },
  };
  </script>
  
  <style>
  .navbar-brand,
  .nav-link {
    color: white !important;
  }
  
  .navbar-toggler-icon {
    background-color: white;
  }
  
  .navbar-toggler {
    border-color: white;
  }
  
  .nav-item.active .nav-link {
    color: white;
  }
  
  .navbar-nav .nav-link {
    color: white;
    margin-right: 10px;
  }
  
  @keyframes slide-in-left {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
  
  .slide-in-left {
    animation: slide-in-left 0.5s ease-out;
  }
  
  .btn-success {
    margin: 20px 0;
    margin-left: 82% !important;
  }
  
  .btn-danger {
    margin-left: 4px;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Transparent black background */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    display: block;
    background-color: white;
    width: 400px;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  }
  
  .modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 20px; /* Đặt kích thước phông chữ của nút đóng */
  }
  
  .form-group {
    margin-bottom: 20px; /* Khoảng cách giữa các nhóm form */
  }
  
  .form-control {
    width: 100%; /* Căn chỉnh input để nó chiếm đủ chiều rộng */
    padding: 10px; /* Đặt padding cho input */
    font-size: 16px; /* Đặt kích thước phông chữ cho input */
    border: 1px solid #ccc; /* Hiển thị đường viền cho input */
    border-radius: 5px; /* Bo góc cho input */
  }
  
  .btn-primary {
  }
  
  .btn-primary:hover {
    background-color: #0056b3; /* Màu nền của nút khi hover */
  }
  </style>