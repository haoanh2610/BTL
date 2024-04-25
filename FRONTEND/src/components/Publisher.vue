<template>
  <div>
    <Navbar />
    <div class="search-container">
  <input type="text" v-model="searchQuery" placeholder="Search publishers by name">
</div>

    <!-- Danh sách nhà xuất bản -->
    <h1>List Publisher</h1>
    <table class="table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="publisher in filteredPublishers" :key="publisher._id">
          <td><img :src="publisher.image" alt="Hình Ảnh" style="max-width: 100px; max-height:100px" @click="openModal(book.img)"></td>
          <td>{{ publisher.name }}</td>
          <td>{{ publisher.address }}</td>
          <td>
            <!-- Sửa nhà xuất bản -->
            <button class="btn btn-primary" @click="editPublisher(publisher)">Edit</button> 
            <!-- Xóa nhà xuất bản -->
            <button class="btn btn-danger" @click="deletePublisher(publisher._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Nút thêm mới nhà xuất bản -->
    <button  class="btn btn-success" @click="$router.push('/pubadd')">Add Publisher</button>
    
    <!-- Modal chỉnh sửa nhà xuất bản -->
<div v-if="showEditPublisherModal" class="modal-overlay">
  <div class="modal-content">
    <span class="close-btn" @click="closeEditPublisherModal">&times;</span>
    <h3 style="text-align: center;">Chỉnh sửa nhà xuất bản</h3>
    <form @submit.prevent="updatePublisher">
      <div class="form-group">
        <label for="editPublisherName">Tên nhà xuất bản:</label>
        <input type="text" class="form-control" id="editPublisherName" v-model="editedPublisher.name">
      </div>
      <div class="form-group">
        <label for="editPublisherAddress">Địa chỉ:</label>
        <input type="text" class="form-control" id="editPublisherAddress" v-model="editedPublisher.address">
      </div>
      <button type="submit" class="btn btn-primary">Lưu</button>
    </form>
  </div>
</div>

  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';
import publisherService from '@/services/publisherservices';

export default {
  components: {
    Navbar
  },
  data() {
    return {
      publishers: [],
      showEditPublisherModal: false,
      editedPublisher: {
        _id: null,
        name: '',
        address: '',
        image: ''
      },
      searchQuery: ''
    };
  },
  methods: {
    
    fetchPublishers() {
      publisherService.fetchPublishers()
        .then(data => {
          this.publishers = data;
        })
        .catch(error => {
          console.error('Error fetching publishers:', error);
        });
    },
    deletePublisher(publisherId) {
      if (confirm("Are you sure you want to delete this publisher?")) {
        publisherService.deletePublisher(publisherId)
          .then(() => {
            console.log('Publisher deleted successfully');
            // Loại bỏ nhà xuất bản khỏi mảng publishers sau khi xóa
            this.publishers = this.publishers.filter(publisher => publisher._id !== publisherId);
          })
          .catch(error => {
            console.error('There was an error!', error);
          });
      }
    },
     // Lấy danh sách nhà xuất bản và hiển thị modal chỉnh sửa
     editPublisher(publisher) {
    this.editedPublisher._id = publisher._id;
    this.editedPublisher.name = publisher.name;
    this.editedPublisher.address = publisher.address;
    this.showEditPublisherModal = true;
  },
    // Đóng modal chỉnh sửa nhà xuất bản
    closeEditPublisherModal() {
      this.showEditPublisherModal = false;
    },
    // Cập nhật nhà xuất bản
    updatePublisher() {
      publisherService.updatePublisher(this.editedPublisher)
        .then(() => {
          console.log('Publisher updated successfully');
          this.closeEditPublisherModal(); // Đóng modal sau khi cập nhật thành công
          this.fetchPublishers(); // Lấy lại danh sách nhà xuất bản
        })
        .catch(error => {
          console.error('Đã xảy ra lỗi khi cập nhật nhà xuất bản:', error);
        });
    }
  },
  computed: {
  filteredPublishers() {
    return this.publishers.filter(publisher => {
      return publisher.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        publisher.address.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
  },
},

  mounted() {
    this.fetchPublishers();
  }
};
</script>

<style>
/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Modal content */
.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
}

/* Form inputs */
.form-group {
  margin-bottom: 20px;
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

.btn-success {
  display: block;
  margin: 20px auto;
  background-color: #2196F3; /* Blue */
  color: white;
}

.btn-success:hover {
  background-color: #1e87f0; /* Darker blue on hover */
}

.btn-secondary {
  background-color: #757575; /* Gray */
  color: white;
}

.btn-secondary:hover {
  background-color: #616161; /* Darker gray on hover */
}

/* Table */
.table {
  width: 100%;
  border-collapse: collapse;
}

/* Table header */
.table th {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: center; /* Căn giữa tiêu đề cột */
}

/* Table data */
.table td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: center; /* Căn giữa dữ liệu trong các ô */
}

/* Thêm padding cho button trong bảng */
.table td button {
  padding: 6px 12px;
}

/* Input search */
.search-container input[type="text"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 20px;
  outline: none;
  transition: border-color 0.3s ease;
}

/* Placeholder text */
.search-container input[type="text"]::placeholder {
  color: #999; /* Màu chữ xám nhạt */
}

/* Hover state */
.search-container input[type="text"]:hover {
  border-color: #999; /* Đổi màu đường viền khi hover */
}

/* Focus state */
.search-container input[type="text"]:focus {
  border-color: #4CAF50; /* Màu xanh lá cây khi focus */
}


</style>