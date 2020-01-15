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
      <!-- 添加分类按钮 -->
      <el-button type="primary" @click="addCateDialogVisible">添加分类</el-button>
      <!-- 用户列表区域 -->
      <tree-table
        class="vtree"
        :data="cateList"
        :columns="columns"
        show-index
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color:lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="danger" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger">删除</el-button>
        </template>
      </tree-table>
      <!-- 页码区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 弹出分类对话框 -->
    <el-dialog
      title="商品分类"
      :visible.sync="cateDialogVisible"
      width="50%"
      @close="closeCateDialogVisible"
    >
      <!-- 内容主体区域 -->
      <el-form ref="cateFormRef" :model="cateForm" label-width="80px" :rules="cateFormRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateForm.cat_name" autofocus="autofocus"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleChange"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 请求商品列表
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 分类列表数据
      cateList: [],
      // 为 table 指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
          width: '240px'
        }
      ],
      // 分类对话框显示隐藏
      cateDialogVisible: false,
      // 添加分类表单数据
      cateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 分类表单验证规则
      cateFormRules: {
        cat_name: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 选中的父级分类 id
      selectedKeys: [],
      // 级联选择器的属性对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      }
    }
  },
  methods: {
    // 获取商品分类列表
    async getGoodsCateList() {
      const { data: res } = await this.$axios.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('error')
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(this.total)
      console.log(this.cateList)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsCateList()
    },
    // 添加分类
    addCateDialogVisible() {
      this.getParentCateList()
      this.cateDialogVisible = true
    },
    // 获取父级分类列表
    async getParentCateList() {
      const { data: res } = await this.$axios.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error('false')
      this.parentCateList = res.data
      console.log(res.data)
    },
    handleChange() {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.cateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.cateForm.cat_level = this.selectedKeys.length
      } else {
        this.cateForm.cat_pid = 0
        this.cateForm.cat_level = 0
      }
    },
    addCate() {
      console.log(this.cateForm)
      this.$refs.cateFormRef.validate(async valid => {
        if (!valid) return this.$message.error('false')
        console.log(this.cateForm)
        const { data: res } = await this.$axios.post(
          'categories',
          this.cateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.cateDialogVisible = false
        this.getGoodsCateList()
        console.log(res.data)
      })
    },
    closeCateDialogVisible() {
      this.$refs.cateFormRef.resetFields()
      this.selectedKeys = []
      this.cateForm.cat_pid = 0
      this.cateForm.cat_level = 0
    }
  },
  created() {
    this.getGoodsCateList()
  }
}
</script>

<style lang="less" scoped>
.vtree {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>