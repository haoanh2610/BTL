// userService.js

import axios from 'axios';

const userService = {
  async fetchUsers() {
    return axios.get('http://localhost:3500/api/get-all-user')
      .then(response => {
        const data = response.data;
        if (data.errCode === 0) {
          return data.data;
        } else {
          throw new Error('Error fetching users: ' + data.errMessage);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        throw error;
      });
  },

  async deleteUser(userId) {
    return axios.delete(`http://localhost:3500/api/delete-user/${userId}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        throw error;
      });
  },

  async updateUser(formData) {
    return axios.put(`http://localhost:3500/api/edit-user/`, formData)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Error updating user:', error);
        throw error;
      });
  },

  async getUserData() {
    try {
      const response = await axios.get('http://localhost:3500/api/get-all-user');
      const data = response.data;
      if (data.errCode === 0) {
        // Lấy thông tin người dùng từ response và trả về
        return data.data[0]; // Đây là ví dụ, bạn cần điều chỉnh để lấy thông tin người dùng phù hợp
      } else {
        console.error('Error fetching user data:', data.errMessage);
        throw new Error(data.errMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  async editUser(userData) {
    try {
      const response = await axios.put('http://localhost:3500/api/edit-user', userData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error editing user:', error);
      throw error;
    }
  },
  async login(username, password) {
    try {
      const response = await axios.post('http://localhost:3500/api/user-login', { username, password });
      const data = response.data;
      if (data.user && data.user._id) {
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'Admin') {
          return '/home';
        } else if (data.user.role === 'User') {
          return '/';
        } else {
          // Xử lý trường hợp role không xác định hoặc các trường hợp khác
          return null; // hoặc throw new Error('Unknown role');
        }
      } else {
        return 'Invalid username or password. Please try again.';
      }
    } catch (error) {
      console.error('Error:', error);
      return 'An error occurred. Please try again later.';
    }
  }
};

export default userService;
