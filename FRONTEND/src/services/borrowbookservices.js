import axios from 'axios';

const baseUrl = 'http://localhost:3500/api';

const borrowedBookService = {
  async fetchBorrowedBooks() {
    try {
      const response = await axios.get(`${baseUrl}/get-all-borrow-book`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      throw error;
    }
  },

  async confirmDelete(borrowedBookId) {
    try {
      if (confirm('Are you sure you want to delete this borrowed book?')) {
        await axios.delete(`${baseUrl}/delete-borrow-book/${borrowedBookId}`);
      }
    } catch (error) {
      console.error('Error deleting borrowed book:', error);
      throw error;
    }
  },

  async updateBorrowBookStatus(borrowBook) {
    try {
      const response = await axios.put(`${baseUrl}/edit-borrow-book`, {
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
      throw error;
    }
  },
  async registerBorrow(bookId, borrowData) {
    try {
      const response = await axios.post('http://localhost:3500/api/borrow-book', borrowData);
      const data = response.data;
      if (data.errCode === 0) {
        return { success: true, message: 'Bạn đã đăng ký mượn sách thành công và đang chờ duyệt.' };
      } else {
        console.error('Error registering borrow:', data.errMessage);
        return { success: false, message: data.errMessage };
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  async getBorrowedBooksByUserId(userId) {
    try {
      const response = await axios.get(`http://localhost:3500/api/get-all-borrow-book?userId=${userId}`);
      const data = response.data;
      if (data.errCode === 0) {
        return data.data.filter(item => item.user._id === userId); // Return borrowed books if successful
      } else {
        throw new Error(data.errMessage); // Throw an error if fetching borrowed books fails
      }
    } catch (error) {
      console.error('Error:', error);
      throw new Error('An error occurred. Please try again later.'); // Re-throw the error to handle it in the component
    }
  }
  
};

export default borrowedBookService;
