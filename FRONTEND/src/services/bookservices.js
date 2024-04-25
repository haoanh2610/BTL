// services/bookService.js

import axios from 'axios';

const bookService = {
  async getAllPublishers() {
    try {
      const response = await axios.get('http://localhost:3500/api/get-all-publisher');
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu nhà xuất bản từ API:', error);
      throw error;
    }
  },

  async fetchBooks() {
    try {
      const response = await axios.get('http://localhost:3500/api/get-all-book');
      const books = response.data.data;
      for (const book of books) {
        const publisherResponse = await axios.get(`http://localhost:3500/api/get-detail-publisher-by-id/${book.publisher}`);
        book.publisherName = publisherResponse.data.data;
      }
      return books;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sách từ API:', error);
      throw error;
    }
  },

  async updateBook(book) {
    try {
      const response = await axios.put("http://localhost:3500/api/edit-book", book);
      console.log("Cập nhật sách thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật sách:", error);
      throw error;
    }
  },

  async deleteBook(bookId) {
    try {
      await axios.delete(`http://localhost:3500/api/delete-book/${bookId}`);
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa sách:', error);
      throw error;
    }
  },

  async addBook(newBook) {
    return axios.post('http://localhost:3500/api/create-book', newBook)
      .then(response => {
        console.log('Book added successfully:', response.data);
        alert('Book added successfully!');
        return response.data; // Trả về dữ liệu của sách đã được thêm
      })
      .catch(error => {
        console.error('Error adding book:', error);
        alert('Error adding book. Please try again.');
        throw error; // Ném lỗi để bắt ở phía component
      });
  },
  async updateOrAddBook(bookData) {
    try {
      if (bookData._id) {
        // Nếu _id tồn tại, đây là việc cập nhật sách đã tồn tại
        const response = await axios.put("http://localhost:3500/api/edit-book", bookData);
        console.log("Edit sách thành công!");
        return response.data;
      } else {
        // Nếu không, đây là việc thêm sách mới
        const response = await axios.post("http://localhost:3500/api/create-book", bookData);
        console.log("Book created successfully:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error("There was an error!", error);
      throw error; // Ném lỗi để bắt ở phía component
    }
  },
  async getBookDetail(bookId) {
    try {
      const response = await axios.get(`http://localhost:3500/api/get-detail-book-by-id/${bookId}`);
      const data = response.data;
      if (data.errCode === 0) {
        return data.data;
      } else {
        console.error('Error fetching book detail:', data.errMessage);
        throw new Error(data.errMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  
};

export default bookService;
