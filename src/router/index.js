import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', direct: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
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
