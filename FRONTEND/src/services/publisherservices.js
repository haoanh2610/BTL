import axios from 'axios';

const publisherService = {
  async fetchPublishers() {
    return axios.get('http://localhost:3500/api/get-all-publisher')
      .then(response => {
        if (response.data.errCode === 0) {
          return response.data.data;
        } else {
          throw new Error(response.data.errMessage);
        }
      })
      .catch(error => {
        throw error;
      });
  },

  async deletePublisher(publisherId) {
    return axios.delete(`http://localhost:3500/api/delete-publisher/${publisherId}`)
      .then(() => {
        console.log('Publisher deleted successfully');
        return publisherId;
      })
      .catch(error => {
        throw error;
      });
  },

  async updatePublisher(editedPublisher) {
    return axios.put(`http://localhost:3500/api/edit-publisher`, {
      _id: editedPublisher._id,
      name: editedPublisher.name,
      address: editedPublisher.address
    })
    .then(() => {
      console.log('Publisher updated successfully');
      return;
    })
    .catch(error => {
      throw error;
    });
  },
  async addPublisher(newPublisher) {
    return axios.post('http://localhost:3500/api/create-publisher', newPublisher)
      .then(response => {
        console.log('Publisher added successfully:', response.data);
        return response.data; // Return the response data if needed
      })
      .catch(error => {
        console.error('Error adding publisher:', error);
        throw error; // Throw the error to handle it in the calling function
      });
  }
  
};

export default publisherService;
