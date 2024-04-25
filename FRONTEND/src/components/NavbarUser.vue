<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link to="/" class="navbar-brand">Book</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <button v-if="loggedInUser" @click="detailuser" class="btn btn-primary">{{ loggedInUser.username }}</button>
            <button v-if="loggedInUser" @click="logout" class="btn btn-outline-primary ml-2">Logout</button>
            <router-link v-else to="/login" class="btn btn-outline-primary">Login</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import router from '@/router';

export default {
  name: 'NavbarUser',
  props: {
    loggedInUser: {
      type: Object,
      required: true
    }
  },
  methods: {
    detailuser() {
      router.push('/detailuser');
    },
    async logout() {
      localStorage.removeItem('user');
      await this.$nextTick(); // Chờ Vue cập nhật lại giao diện trước khi chuyển hướng
      router.push('/bookclient');
      window.location.reload(); // Làm mới trang để áp dụng trạng thái đã đăng xuất
    }
  }
};
</script>

<style scoped>
/* Điều chỉnh CSS theo mẫu */
.navbar-brand {
  font-size: 1.5rem;
}

.navbar-nav .nav-link {
  padding: .5rem 1rem;
}

.navbar-toggler {
  border: none;
}

.nav-link {
  color: #007bff;
}

.nav-link:hover {
  color: #0056b3;
}
</style>
