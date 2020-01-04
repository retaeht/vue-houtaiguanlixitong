<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>Header</el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">Aside</el-aside>
      <!-- 右侧内容主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  .el-header {
    background-color: #373D41;
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #fff;
  }
</style>
