// Vuex store
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false,
    username: '', // Store the username after successful login
    // Other state properties
  },
  getters: {
    loggedIn: state => state.loggedIn,
    username: state => state.username,
  },
  // Mutations, actions, etc.
});
