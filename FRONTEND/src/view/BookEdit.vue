<template>
  <div>
    <h1>Edit Book</h1>
    <form @submit.prevent="updateBook">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" class="form-control" id="name" v-model="editedBook.name">
      </div>
      <div class="form-group">
        <label for="price">Price:</label>
        <input type="number" class="form-control" id="price" v-model="editedBook.price">
      </div>
      <div class="form-group">
        <label for="quantity">Quantity:</label>
        <input type="number" class="form-control" id="quantity" v-model="editedBook.quantity">
      </div>
      <div class="form-group">
        <label for="publishYear">Publish Year:</label>
        <input type="number" class="form-control" id="publishYear" v-model="editedBook.publishYear">
      </div>
      <div class="form-group">
        <label for="publisher">Publisher:</label>
        <input type="text" class="form-control" id="publisher" v-model="editedBook.publisher">
      </div>
      <div class="form-group">
        <label for="author">Author:</label>
        <input type="text" class="form-control" id="author" v-model="editedBook.author">
      </div>
      <button type="submit" class="btn btn-primary">Update</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import bookService from '@/services/bookservices';

export default {
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
      editBook(book) {
        this.editBookData = { ...book };
        this.editBookData.publisher = this.publishers.find(
          (publisher) => publisher._id === book.publisher._id
        );
        this.modalTitle = "Chỉnh sửa sách";
        this.isAddingNewBook = false;
        this.showEditModal = true;
      },
      async updateBook() {
  try {
    if (this.editBookData._id) {
      // Nếu _id tồn tại, đây là việc cập nhật sách đã tồn tại
      await bookService.updateBook(this.editBookData);
      console.log("Edit sách thành công!");
    } else {
      // Nếu không, đây là việc thêm sách mới
      await bookService.addBook(this.editBookData);
      console.log("Book created successfully!");
    }
    this.showEditModal = false;
    this.fetchBooks();
  } catch (error) {
    console.error("There was an error!", error);
  }
},
    }
};
</script>

<style>
/* Add your custom styles here */
</style>
