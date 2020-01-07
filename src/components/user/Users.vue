<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <!-- 搜索文本框 -->
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="create_time" label="创建日期"></el-table-column>
        <el-table-column prop="mg_state" label="用户状态">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="超级管理员"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getMotifyDialogVisible(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              @click="deleteById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
            <!-- {{ scope.row }} -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 弹出用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="dialogClose">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹出修改对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="motifyDialogVisible"
      width="50%"
      @close="motifyDialogClose"
    >
      <!-- 内容主体区域 -->
      <el-form :model="motifyForm" :rules="motifyFormRules" ref="motifyFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="motifyForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="motifyForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="motifyForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="motifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="motifyUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证手机
    var checkMobile = (rules, val, cb) => {
      const regMobile = /0?(13|14|15|18|17)[0-9]{9}/
      if (regMobile.test(val)) {
        return cb()
      }
      cb(new Error('手机号码错误'))
    }
    var checkEmail = (rules, val, cb) => {
      const regEmail = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      if (regEmail.test(val)) {
        return cb()
      }
      cb(new Error('邮箱错误'))
    }
    return {
      // 查询用户列表的参数对象
      queryInfo: {
        // 查询用户
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页几条
        pagesize: 2
      },
      // 用户列表
      userList: [],
      // 总共数据
      total: 0,
      // 用户对话框的显示隐藏
      dialogVisible: false,
      // 修改对话框的显示隐藏
      motifyDialogVisible: false,
      // 添加用户数据对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户数据对象
      motifyForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 这是表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机',
            trigger: 'blur'
          },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 这是修改表单的验证规则对象
      motifyFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机',
            trigger: 'blur'
          },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听一页显示几条
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 用户状态改变
    async userStatusChange(val) {
      console.log(val)
      const { data: res } = await this.$axios.put(
        `users/${val.id}/state/${val.mg_state}`
      )
      if (res.meta.status !== 200) {
        val.mg_state = !val.mg_state
        return this.$message.error({
          message: '更新状态失败',
          duration: 1000
        })
      }
      this.$message.error({
        message: '更新状态成功',
        duration: 1000
      })
    },
    // 监听用户对话框关闭事件
    dialogClose() {
      // console.log(this.$refs.addFormRef)
      this.$refs.addFormRef.resetFields()
      this.dialogVisible = false
    },
    // 监听修改用户对话框关闭事件
    motifyDialogClose() {
      this.$refs.motifyFormRef.resetFields()
      this.motifyDialogVisible = false
    },
    // 提交表单并进行表单预验证
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$axios.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('提交用户失败')
        console.log(res)
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 通过 id 获取用户数据，打开对话框
    async getMotifyDialogVisible(obj) {
      console.log(obj)
      const { data: res } = await this.$axios.get('users/' + obj.id)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      console.log(res)
      this.motifyForm.id = obj.id
      this.motifyForm.username = obj.username
      this.motifyForm.email = obj.email
      this.motifyForm.mobile = obj.mobile
      this.motifyDialogVisible = true
    },
    // 修改表单并进行表单预验证
    motifyUser() {
      this.$refs.motifyFormRef.validate(async valid => {
        if (!valid) return this.$message.error('修改数据失败')
        console.log(this.motifyForm.id)
        const { data: res } = await this.$axios.put(
          'users/' + this.motifyForm.id,
          { email: this.motifyForm.email, mobile: this.motifyForm.mobile }
        )
        if (res.meta.status !== 200) return false
        console.log(res)
        // 关闭对话框
        this.motifyDialogClose()
        // 更新表单
        this.getUserList()
        this.$message.success('修改数据成功')
      })
    },
    // 删除用户
    deleteById(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete('users/' + id)
          if (res.meta.status !== 200) return this.$message.error('修改数据失败')
          this.getUserList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
</style>