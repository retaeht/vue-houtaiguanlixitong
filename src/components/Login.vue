<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form label-width="0px" class="login-form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="loginFormReset">重置</el-button>
       </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
          // { pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/, message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 8 - 30位' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置表单
    loginFormReset () {
      // console.log(this)
      // 获取表单对象
      this.$refs.loginFormRef.resetFields()
    },
    // 登陆
    login () {
      // 实现登陆 表单预验证 参数为一个回调函数
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return false
        // 解构
        const { data: res } = await this.$axios.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        console.log(res)
        // 1.登陆成功后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中除了登陆意外的其他 api 接口，必须在登陆之后才能访问
        //   1.2 token 直营在当前网站代开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login-container {
    background-color: #2b4b6b;
    height: 100%;
    position: relative;
  }
  .login-box {
      width: 450px;
      height: 300px;
      background-color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      border-radius: 3px;
      .logo {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        background-color: #fff;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
      }
    }
  .login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btn {
    display: flex;
    justify-content: flex-end;
  }

</style>
