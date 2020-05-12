import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
// import Roles from '../components/root/Roles.vue'
// import Rights from '../components/root/Rights.vue'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/root/Roles.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/root/Rights.vue')

// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

// import Goods from '../components/goods/Goods.vue'
// import Add from '../components/goods/Add.vue'
const Goods = () => import(/* webpackChunkName: "Goods_Add" */ '../components/goods/Goods.vue')
const Add = () => import(/* webpackChunkName: "Goods_Add" */ '../components/goods/Add.vue')

// import Orders from '../components/order/Orders.vue'
// import Report from '../components/report/Report.vue'
const Orders = () => import(/* webpackChunkName: "Orders_Report" */ '../components/order/Orders.vue')
const Report = () => import(/* webpackChunkName: "Orders_Report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', 
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径； from 从哪个路径来；
  // next是一个函数，表示放行
  //    next() 放行  next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有 token 强制跳转到登陆页
  if (!tokenStr) return next('/login')
  // 否则放行
  next()
})
export default router
