import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import axios from 'axios'
// tree组件
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本对应样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入 Nprogress 包对应的js和css
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 配置根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// 全局配置富文本
Vue.use(VueQuillEditor/* { default global options } */)
// 配置请求预处理
axios.interceptors.request.use(config => {
  // 得到配置对象
  console.log(config)
  // 在拦截器中，展示进度条 Nprogress.start()
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
// 在拦截器中，隐藏进度条 Nprogress.done()
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.filter('format', function (value) {
  const dt = new Date(value)
  const y = dt.getFullYear()
  // 不足两位 前面加0
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
