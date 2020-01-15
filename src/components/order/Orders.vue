<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 订单搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getOrderList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区域 -->
      <el-table :data="orderList" style="width: 100%" border>
        <el-table-column type="index" label="#" width="90"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column width="90px" prop="order_price" label="订单价格"></el-table-column>
        <el-table-column width="80px" prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay === '1'" type="primary">已付款</el-tag>
            <el-tag type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="90px" prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200px">
          <template slot-scope="scope">{{ scope.row.create_time | format }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editLocal"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProcessBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
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

    <!-- 修改订单地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="editLocalDialogVisible" width="50%">
      <!-- 主内容区域 -->
      <el-form
        label-position="right"
        label-width="90px"
        v-model="addressForm"
        ref="addressFormRef"
        :rules="addressFormRules"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <!-- footer区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editLocalDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editLocalDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 显示进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="showProcessDialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      orderList: [],
      // 修改订单地址对话框显示隐藏
      editLocalDialogVisible: false,
      // 显示进度对话框
      showProcessDialogVisible: false,
      // 修改地址表单
      addressForm: {
        address1: [],
        address2: ''
      },
      // 修改地址表单规则
      addressFormRules: {
        address1: [{ required: true, message: '请输入', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      // 全国地址
      cityData,
      // 物流信息
      progressInfo: []
    }
  },
  methods: {
    getOrderList() {
      this.$axios
        .get('orders', { params: this.queryInfo })
        .then(res => {
          console.log(res.data.data)
          this.orderList = res.data.data.goods
          this.total = res.data.data.total
          console.log(this.orderList)
        })
        .catch(err => {
          this.$message.error('false')
          console.log(err)
        })
    },
    handleSizeChange(value) {
      this.queryInfo.pagesize = value
      this.getOrderList()
    },
    handleCurrentChange(value) {
      this.queryInfo.pagenum = value
      this.getOrderList()
    },
    // 修改订单地址
    editLocal() {
      this.editLocalDialogVisible = true
    },
    // 一些未知原因导致不能正常使用
    showProcessBox() {
      this.$axios
        .get('/kuaidi/804909574412544580')
        .then(res => {
          this.progressInfo = res.data.data
        })
        .catch(err => {
          this.$message.error('获取物流进度失败')
          console.log(err)
        })
      this.showProcessDialogVisible = true
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>