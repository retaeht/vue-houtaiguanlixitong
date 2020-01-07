<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- toggle折叠按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- 注意 index需要唯一，所以动态绑定数据，并且值要字符型 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="menuIcon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="getNavStatus('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-s-grid"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 侧边栏数据
      menuList: [],
      // 侧边栏图标
      menuIcon: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 侧边栏折叠标识符
      isCollapse: false,
      // 激活路径
      activePath: ''
    }
  },
  methods: {
    exit() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 请求侧边栏数据
    async getMenuList() {
      const { data: res } = await this.$axios.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 侧边栏折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 激活路径状态
    getNavStatus(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    img {
      height: 100%;
    }
    span {
      margin-left: 15px;
      color: #fff;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #fff;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  line-height: 24px;
  font-size: 14px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  user-select: none;
  // background-color: #fff;
}
</style>
