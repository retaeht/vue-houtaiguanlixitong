<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- alert 警告 -->
      <el-alert title="添加商品信息 alert" type="info" :closable="false"></el-alert>
      <!-- 进度条区域 -->
      <el-steps :space="200" :active="activeIndex-0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs 区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          @tab-click="tabCliked"
          :before-leave="beforeLeave"
        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProp"
                @change="handleChange"
                width="200px"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <!-- 渲染表单的 item 项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item2"
                  v-for="(item2, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
      <img :src="previewPath" alt class="previewStyle" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      // 步骤索引
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_cat: [],
        // 上传的图片临时路径
        pics: [],
        // 商品的详细描述
        goods_introduce: '',
        goods_number: '0',
        goods_price: '0',
        goods_weight: '0',
        attr: []
      },
      // 验证表单规则
      addFormRules: {
        goods_name: [{ required: true, message: '输入内容', trigger: 'blur' }],
        goods_price: [{ required: true, message: '输入内容', trigger: 'blur' }],
        goods_weight: [
          { required: true, message: '输入内容', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '输入内容', trigger: 'blur' }
        ],
        goods_cat: [{ required: true, message: '输入内容', trigger: 'blur' }]
      },
      // 级联选择器配置项
      cateProp: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      //
      selectedCate: '',
      //
      cateList: [],
      // 动态参数列表
      manyTableData: [],
      // 静态参数列表
      onlyTableData: [],
      // 上传图片URL
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传图片请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片路径
      previewPath: '',
      // 图片预览显示隐藏
      dialogVisible: false
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) return this.$message.error('false')
      console.log(res.data)
      this.cateList = res.data
    },
    //
    handleChange() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length === 3) {
        return
      }
      this.addForm.goods_cat = []
    },
    // 在进入下一个标签之前
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('只允许三级分类')
        return false
      }
    },
    async tabCliked() {
      // 获取动态参数
      if (this.activeIndex === '1') {
        const { data: res } = await this.$axios.get(
          'categories/' + this.cateId + '/attributes',
          { params: { sel: 'many' } }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('false')
        }
        console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      }
      // 获取静态参数
      if (this.activeIndex === '2') {
        const { data: res } = await this.$axios.get(
          'categories/' + this.cateId + '/attributes',
          { params: { sel: 'only' } }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('false')
        }
        console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    // 图片上传成功 返回数据
    handleSuccess(response) {
      this.addForm.pics.push(response.data.tmp_path)
      console.log(this.addForm)
    },
    // 图片删除 返回数据
    handleRemove(file) {
      const picPath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(item => {
        return item === picPath
      })
      this.addForm.pics.splice(index, 1)
    },
    // 图片预览效果
    handlePreview(file) {
      const picPath = file.response.data.url
      this.previewPath = picPath
      this.dialogVisible = true
      console.log(this.previewPath)
    },
    add() {
      console.log(this.addForm)
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('false')
        }
        this.manyTableData.forEach(item => {
          const obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attr.push(obj)
        })
        this.onlyTableData.forEach(item => {
          const obj = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attr.push(obj)
        })
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        console.log(form)
        const { data: res } = await this.$axios.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('false')
        this.addForm.attr = []
        this.$router.push('/goods')
      })
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.previewStyle {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>