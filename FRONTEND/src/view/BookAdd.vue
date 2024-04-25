<template>
  <div class="container">
    <h1>Add New Book</h1>
    <form @submit.prevent="addBook">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" class="form-control" id="name" v-model="newBook.name">
      </div>
      <div class="form-group">
        <label for="price">Price:</label>
        <input type="number" class="form-control" id="price" v-model="newBook.price">
      </div>
      <div class="form-group">
        <label for="quantity">Quantity:</label>
        <input type="number" class="form-control" id="quantity" v-model="newBook.quantity">
      </div>
      <div class="form-group">
        <label for="publishYear">Publish Year:</label>
        <input type="number" class="form-control" id="publishYear" v-model="newBook.publishYear">
      </div>
      <div class="form-group">
        <label for="author">Author:</label>
        <input type="text" class="form-control" id="author" v-model="newBook.author">
      </div>
      <div class="form-group">
        <label for="publisher">Publisher:</label>
        <select class="form-control" id="publisher" v-model="newBook.publisher">
          <option v-for="publisher in publishers" :value="publisher._id">{{ publisher.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="image">Image URL:</label>
        <input type="text" class="form-control" id="image" v-model="newBook.image">
      </div>
      <div class="form-group button-group">
  <button type="submit" class="btn btn-primary">Add Book</button>
  <button @click="$router.push('/books')" class="btn btn-secondary">Cancel</button>
</div>

    </form>
  </div>
</template>


<script>
import axios from 'axios';
import bookService from '@/services/bookservices';
import publisherService from '@/services/publisherservices';

export default {
  data() {
    return {
      newBook: {
        name: '',
        price: null,
        quantity: null,
        publishYear: null,
        author: '',
        publisher: '',
        image: ''
      },
      publishers: []
    };
  },
  mounted() {
    this.fetchPublisher();
  },
  methods: {
    async fetchPublisher() {
      this.publishers = await publisherService.fetchPublishers();
    },
    async addBook() {
      try {
        await bookService.addBook(this.newBook);
        // Reset the form fields after successful submission
        this.newBook = {
          name: '',
          price: null,
          quantity: null,
          publishYear: null,
          author: '',
          publisher: '',
          image: ''
        };
      } catch (error) {
        console.error('Error adding book:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Container for the form */
.container {
  width: 50%; /* Set the width of the container */
  margin: 0 auto; /* Center the container horizontally */
  padding-top: 50px; /* Add some top padding for better spacing */
}

/* Form group */
.form-group {
  margin-bottom: 20px; /* Add bottom margin for better spacing between form fields */
}

/* Label for form fields */
label {
  display: block; /* Display labels as blocks */
  font-weight: bold; /* Make labels bold */
}

/* Input fields */
input[type="text"],
input[type="number"],
select {
  width: 100%; /* Set the width of input fields to 100% */
  padding: 10px; /* Add padding to input fields */
  font-size: 16px; /* Set font size for input fields */
  border: 1px solid #ccc; /* Add border to input fields */
  border-radius: 5px; /* Add border radius to input fields */
}

/* Button */
button {
  padding: 10px 20px; /* Add padding to the button */
  background-color: #007bff; /* Set background color for the button */
  color: #fff; /* Set text color for the button */
  border: none; /* Remove border from the button */
  border-radius: 5px; /* Add border radius to the button */
  cursor: pointer; /* Set cursor to pointer for better interaction */
  transition: background-color 0.3s ease; /* Smooth transition on hover */
}

/* Button hover effect */
button:hover {
  background-color: #0056b3; /* Change background color on hover */
}

.button-group {
  display: flex;
  justify-content: space-between;
}

</style>

