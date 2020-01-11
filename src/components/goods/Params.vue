<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 警告提示区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>
      <!-- 级联选择器 -->
      <el-row>
        <el-col>
          <p>
            选择商品分类：
            <el-cascader
              v-model="checkedKey"
              :options="parentCateList"
              :props="cascaderProps"
              @change="handleChange"
            ></el-cascader>
          </p>
        </el-col>
      </el-row>
      <!-- tabs 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="tabsClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisable"
            size="mini"
            @click="paramsDialogVisible=true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  class="vtag-right"
                  closable
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="getEditDialogVisible(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParam(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisable"
            size="mini"
            @click="paramsDialogVisible=true"
          >添加参数</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  class="vtag-right"
                  closable
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput2"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput2(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="getEditDialogVisible(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParam(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 弹出添加参数对话框 -->
    <el-dialog
      :title="'添加'+dialogTitle"
      :visible.sync="paramsDialogVisible"
      width="50%"
      @close="closeParamsDialogVisible"
    >
      <!-- 内容主体区域 -->
      <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name" autofocus="autofocus"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParam">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹出修改对话框 -->
    <el-dialog
      :title="'修改'+dialogTitle"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeEditDialogVisible"
    >
      <!-- 内容主体区域 -->
      <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="editFormRules">
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name" autofocus="autofocus"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 选中的商品
      checkedKey: [],
      // 父级分类列表
      parentCateList: [],
      // 级联选择器属性对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 被激活标签的名字
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      // 参数对话框显示与隐藏
      paramsDialogVisible: false,
      // 修改对话框显示与隐藏
      editDialogVisible: false,
      // 添加参数表单对象
      addForm: {},
      // 修改参数表单对象
      editForm: {},
      // 添加参数表单验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 添加参数表单验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取列表
    async getGoodsCateList() {
      const { data: res } = await this.$axios.get('categories', {
        params: { type: 3 }
      })
      if (res.meta.status !== 200) return this.$message.error('error')
      this.parentCateList = res.data
      console.log(res.data)
    },
    // 监听级联选择器
    async handleChange() {
      if (this.checkedKey.length !== 3) {
        this.checkedKey = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      console.log(this.checkedKey)
      const { data: res } = await this.$axios.get(
        'categories/' + this.cateId + '/attributes',
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) return this.$message.error('false')
      console.log(res.data)
      res.data.forEach(item => {
        // 解决 小bug
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : ''
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 切换页签
    tabsClick() {
      this.handleChange()
    },
    // 关闭参数对话框
    closeParamsDialogVisible() {
      this.$refs.addFormRef.resetFields()
    },
    // 关闭参数对话框
    closeEditDialogVisible() {},
    // 添加参数
    async addParam() {
      const { data: res } = await this.$axios.post(
        'categories/' + this.cateId + '/attributes',
        { attr_name: this.addForm.attr_name, attr_sel: this.activeName }
      )
      if (res.meta.status !== 201) return this.$message.error('false')
      console.log(res.data)
      this.paramsDialogVisible = false
      if (this.activeName === 'many') {
        this.manyTableData.push(res.data)
      } else {
        this.onlyTableData.push(res.data)
      }
    },
    // 修改参数
    editParam() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('false')
        const { data: res } = await this.$axios.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) return this.$message.error('false')
        this.editDialogVisible = false
        this.handleChange()
      })
    },
    // 弹出修改对话框
    async getEditDialogVisible(obj) {
      this.editDialogVisible = true

      console.log(obj)
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes/${obj.attr_id}`
      )
      if (res.meta.status !== 200) return this.$message.error('false')
      this.editForm = res.data
    },
    // 删除参数
    deleteParam(obj) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(
            'categories/' + this.cateId + '/attributes/' + obj.attr_id
          )
          if (res.meta.status !== 200) return this.$message.error('false')
          this.tabsClick()
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
    },
    // 切换 tag 输入框
    showInput(flag) {
      flag.inputVisible = true
      // 当页面渲染之后在执行方法
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    showInput2(flag) {
      flag.inputVisible = true
      // 当页面渲染之后在执行方法
      this.$nextTick(_ => {
        this.$refs.saveTagInput2.$refs.input.focus()
      })
    },
    // 光标离开或回车
    async handleInputConfirm(flag) {
      if (flag.inputValue.trim().length === 0) {
        flag.inputValue = ''
        flag.inputVisible = false
      }
      flag.attr_vals
        ? flag.attr_vals.push(flag.inputValue.trim())
        : (flag.attr_vals = [flag.inputValue])
      flag.inputValue = ''
      flag.inputVisible = false
      this.saveAttrVals(flag)
    },
    // 将对 attr_vals 操作，保留到数据库
    async saveAttrVals(flag) {
      const { data: res } = await this.$axios.put(
        'categories/' + this.cateId + '/attributes/' + flag.attr_id,
        {
          attr_name: flag.attr_name,
          attr_sel: this.activeName,
          attr_vals: flag.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$message.error('false')
      this.$message.success('true')
    },
    handleClose(i, flag) {
      flag.attr_vals.splice(i, 1)
      this.saveAttrVals(flag)
    }
  },
  created() {
    this.getGoodsCateList()
  },
  computed: {
    isBtnDisable() {
      if (this.checkedKey.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.checkedKey.length === 3) {
        return this.checkedKey[2]
      }
      return null
    },
    dialogTitle() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态参数'
    }
  }
}
</script>

<style lang="less" scoped>
.vtag-right {
  margin-right: 10px;
  margin-bottom: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>