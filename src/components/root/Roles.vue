<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
      <!-- 用户列表区域 -->
      <el-table :data="roleList" style="width: 100%" stripe border>
        <el-table-column type="expand" label>
          <template slot-scope="scope">
            <el-row
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
              :class="['bd-bottom',index1===0?'bd-top':'','vcenter']"
            >
              <!-- 第一列 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 第二列 -->
              <el-col :span="19">
                <el-row v-for=" item2 in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRightById(scope.row,item2.id)"
                    >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 第三列 -->
                  <el-col :span="18" class="vleft">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="deleteRightById(scope.row,item3.id)"
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="290px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="getRightsDialogVisible(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 弹出添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="50%">
      <!-- 主体区域 -->
      <el-form ref="roleFormRef" :model="roleForm" label-width="80px" :rules="roleFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹出分配权限对话跨框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightsDialogVisible"
      width="50%"
      @close="closeRightsDialogVisible"
    >
      <!-- 树形结构组件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        node-key="id"
        show-checkbox
        :default-expand-all="true"
        class="vscroll"
        :default-checked-keys="checkedRight"
        ref="treeRightsRef"
      ></el-tree>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表数据
      roleList: [],
      // 表单数据
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加对象验证规则
      roleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { min: 1, max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ]
      },
      // 角色对话框状态
      dialogVisible: false,
      // 权限对话框状态
      rightsDialogVisible: false,
      // 所有权限数据列表
      rightsList: [],
      // 树形结构对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 选中的权限
      checkedRight: [],
      // 角色 id
      roleId: ''
    }
  },
  methods: {
    // 获取角色列表
    getRoleList() {
      this.$axios
        .get('roles')
        .then(res => {
          this.roleList = res.data.data
          console.log(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加角色
    addRole() {
      this.$refs.roleFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('false')
        }
        this.$axios
          .post('roles', this.roleForm)
          .then(res => {
            console.log(res.data)
            this.$message.success('添加成功')
            this.dialogVisible = false
            this.getRoleList()
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    // 删除角色
    deleteRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .delete('roles/' + id)
            .then(res => {
              console.log(res.data)
              this.getRoleList()
              this.$message.success('成功')
            })
            .catch(err => {
              this.$message.error('失败')
              console.log(err)
            })
        })
        .catch(err => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
          console.log(err)
        })
    },
    // 删除三级权限
    async deleteRightById(user, rightId) {
      const { data: res } = await this.$axios.delete(
        'roles/' + user.id + '/rights/' + rightId
      )
      if (res.meta.status !== 200) return false
      user.children = res.data
      console.log(res.data)
    },
    // 显示分配权限对话框,获取所有权限数据
    async getRightsDialogVisible(obj) {
      const { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.status !== 200) return false
      this.rightsList = res.data
      this.roleId = obj.id
      this.getcheckedRight(obj, this.checkedRight)
      this.rightsDialogVisible = true
    },
    // 通过递归，获取角色下的所有三级权限的 id
    getcheckedRight(node, arr) {
      // 如果对象下没有 children 属性 说明是三级权限
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getcheckedRight(item, arr)
      })
    },
    // 关闭分配权限对话框，清空所有权限数据列表数据
    closeRightsDialogVisible() {
      this.checkedRight = []
    },
    // 分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRightsRef.getCheckedKeys(),
        ...this.$refs.treeRightsRef.getHalfCheckedKeys()
      ]
      const str = keys.join(',')
      const { data: res } = await this.$axios.post(
        'roles/' + this.roleId + '/rights',
        { rids: str }
      )
      if (res.meta.status !== 200) return this.$message.error('失败')
      this.rightsDialogVisible = false
      this.getRoleList()
      console.log(res)
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  text-align: center;
}
.vleft {
  text-align: left;
}
.vscroll {
  height: 320px;
  overflow-y: scroll;
  padding: 15px 20px 0px 20px;
}
</style>