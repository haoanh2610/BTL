import { createWebHistory, createRouter } from "vue-router";
import App from "@/App.vue";
import Book from "@/components/Book.vue";
import Home from "@/components/Home.vue";
import Publisher from "@/components/Publisher.vue";
import BookAdd from "@/view/BookAdd.vue";
import BookEdit from "@/view/BookEdit.vue";
import PubAdd from "@/view/PubAdd.vue";
import BorrowBook from "@/components/BorrowBook.vue";
import Login from "@/view/Login.vue";
import Navbar from "@/components/Navbar.vue";
import User from "@/components/User.vue";
import UserAdd from "@/view/UserAdd.vue";
import Signup from "@/view/Signup.vue";
import BookClient from "@/components/BookClient.vue";
import DetailBook from "@/view/DetailBook.vue";
import DetailUser from "@/view/DetailUser.vue";

const authMiddleware = (to, from, next) => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    // Kiểm tra vai trò của người dùng
    if (loggedInUser) {
      if (loggedInUser.role === 'User' && to.path === '/user' || loggedInUser.role === 'User' && to.path === '/books' || loggedInUser.role === 'User' && to.path === '/publishers' || loggedInUser.role === 'User' && to.path === '/bookadd' || loggedInUser.role === 'User' && to.path === '/bookedit' || loggedInUser.role === 'User' && to.path === '/pubadd' || loggedInUser.role === 'User' && to.path === '/borrowbook' || loggedInUser.role === 'User' && to.path === '/useradd' || loggedInUser.role === 'User' && to.path === '/detailUser') {
        // Nếu là user và đang cố gắng truy cập trang quản trị, chuyển hướng đến trang chính
        next('/'); // Chuyển hướng đến trang chính
      } else {
        // Cho phép truy cập vào các route khác
        next();
      }
    } else {
      // Nếu không có người dùng đăng nhập, chuyển hướng đến trang đăng nhập
      next('/login');
    }
};

  




const routes = [
    {
        path: "/user", component: User,
        beforeEnter: authMiddleware,
    },
    {
        path: "/login", component: Login,
    },
    {
        path: "/navbar" , component: Navbar,
    },
    {
        path: "/books" , component: Book,
        beforeEnter: authMiddleware,
    },
    {
        path: "/publishers" , component: Publisher,
        beforeEnter: authMiddleware,
    },
    {
        path: "/home" , component: Home,
        beforeEnter: authMiddleware,
    },
    {
        path: "/bookadd" , component: BookAdd,
        beforeEnter: authMiddleware,
    },
    {
        path: "/bookedit" , component: BookEdit,
        beforeEnter: authMiddleware,
    },
    {
        path: "/pubadd" , component: PubAdd,
        beforeEnter: authMiddleware,
    },
    {
        path: "/borrowbook" , component: BorrowBook,
        beforeEnter: authMiddleware,
    },
    {
        path: "/useradd" , component: UserAdd,
        beforeEnter: authMiddleware,
    },
    {
        path: "/logout",
        beforeEnter: (to, from, next) => {
            next('/');
        }
    },
    {
        path: "/signup" , component: Signup
    },
    {
        path: "/" , component: BookClient
    
    },
    {
        path: "/book-detail/:bookId" , component: DetailBook
    },
    {
        path: "/detailUser" , component: DetailUser
    }

];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;