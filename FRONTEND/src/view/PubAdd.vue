<template>
    <div class="publisher-form">
      <h2>Add New Publisher</h2>
      <form @submit.prevent="addPublisher" class="form">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="newPublisher.name" required class="form-control">
        </div>
        <div class="form-group">
          <label for="address">Address:</label>
          <input type="text" id="address" v-model="newPublisher.address" required class="form-control">
        </div>
        <div class="form-group">
        <label for="image">Image URL:</label>
        <input type="text" class="form-control" id="image" v-model="newPublisher.image">
      </div>
        <div class="button-group">
          <button type="submit" class="btn btn-primary">Add Publisher</button>
          <button type="button" @click="closeForm" class="btn btn-secondary">Close</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        newPublisher: {
          name: '',
          address: '',
          phoneNumber: '',
          image: ''
        }
      };
    },
    methods: {
      addPublisher() {
        axios.post('http://localhost:3500/api/create-publisher', this.newPublisher)
          .then(response => {
            console.log('Publisher added successfully:', response.data);
            // Reset form fields after adding publisher
            this.newPublisher = {
              name: '',
              address: '',
              phoneNumber: ''
            };
          })
          .catch(error => {
            console.error('Error adding publisher:', error);
          });
      },
      closeForm() {
        // Redirect back to /publishers route
        this.$router.push('/publishers');
      }
    }
  };
  </script>
  
  <style scoped>
.publisher-form {
  max-width: 500px; /* Set maximum width for the form */
  margin: 0 auto; /* Center the form horizontally */
  padding: 20px; /* Add padding to the form */
}

h2 {
  text-align: center; /* Center-align the heading */
  margin-bottom: 20px; /* Add bottom margin to the heading */
}

.form {
  background-color: #f9f9f9; /* Set background color for the form */
  padding: 20px; /* Add padding to the form */
  border-radius: 5px; /* Add border radius to the form */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Add box shadow to the form */
}

.form-group {
  margin-bottom: 20px; /* Add bottom margin to the form group */
}

label {
  display: block; /* Display labels as blocks */
  margin-bottom: 5px; /* Add bottom margin to the labels */
  font-weight: bold; /* Make labels bold */
}

.form-control {
  width: 100%; /* Set width of form controls to 100% */
  padding: 10px; /* Add padding to form controls */
  border: 1px solid #ddd; /* Add border to form controls */
  border-radius: 4px; /* Add border radius to form controls */
}

.button-group {
  display: flex; /* Display button group as flex */
  justify-content: space-between; /* Space buttons evenly within the group */
}

.btn {
  padding: 10px 20px; /* Add padding to buttons */
  border: none; /* Remove border from buttons */
  border-radius: 4px; /* Add border radius to buttons */
  cursor: pointer; /* Set cursor to pointer for better interaction */
  transition: background-color 0.2s; /* Smooth transition on hover */
}

.btn-primary {
  background-color: #007bff; /* Set background color for primary button */
  color: #fff; /* Set text color for primary button */
}

.btn-secondary {
  background-color: #6c757d; /* Set background color for secondary button */
  color: #fff; /* Set text color for secondary button */
}

.btn:hover {
  background-color: #0056b3; /* Change background color on hover */
}
</style>


  