<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" v-hasPermi="['menus:list']">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="菜单名称">
                <a-input v-model="queryParam.name" placeholder="请输入" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operations">
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPermi="['menus:insert']">
          <a-icon type="plus" />新增
        </a-button>
      </div>
      <!-- 增加修改 -->
      <create-form
        ref="createForm"
        :menuOptions="menuOptions"
        @ok="getList"
        @select-tree="getTreeSelect"
      />
      <!-- 数据展示 -->
      <a-table
        :loading="loading"
        :size="tableSize"
        rowKey="id"
        :columns="columns"
        :data-source="list"
        :pagination="false"
        :bordered="tableBordered">
        <span slot="icon" slot-scope="text">
          <a-icon :component="allIcon[text + 'Icon']" v-if="allIcon[text + 'Icon']"/>
          <a-icon :type="text" v-if="!allIcon[text + 'Icon']"/>
        </span>
        <span slot="type" slot-scope="text, record">
          {{ typeFormat(record) }}
        </span>
        <span slot="visible" slot-scope="text, record">
          {{ visibleFormat(record) }}
        </span>
        <span slot="operation" slot-scope="text, record">
          <a @click="$refs.createForm.handleUpdate(record)" v-hasPermi="['menus:update']">
            <a-icon type="edit" />修改
          </a>
          <a-divider type="vertical" v-hasPermi="['menus:insert']" />
          <a @click="$refs.createForm.handleAdd(record)" v-hasPermi="['menus:insert']">
            <a-icon type="plus" />新增
          </a>
          <a-divider type="vertical" v-hasPermi="['menus:delete']" />
          <a @click="handleDelete(record)" v-hasPermi="['menus:delete']">
            <a-icon type="delete" />删除
          </a>
        </span>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>

import { listMenu, listMenuTree, deleteMenuById } from '@/api/v1/menu'
import CreateForm from './modules/CreateForm'
import allIcon from '@/core/icons'
import { tableMixin } from '@/store/table-mixin'

export default {
  name: 'Menus',
  components: {
    CreateForm
  },
  mixins: [tableMixin],
  data () {
    return {
      allIcon,
      iconVisible: false,
      list: [],
      menuOptions: [],
      loading: false,
      queryParam: {
        name: ''
      },
      columns: [
        {
          title: '菜单名称',
          dataIndex: 'name',
          ellipsis: true,
          width: '20%'
        },
        {
          title: '菜单图标',
          dataIndex: 'icon',
          scopedSlots: { customRender: 'icon' },
          align: 'center',
          width: '10%'
        },
        {
          title: '菜单顺序',
          dataIndex: 'sort',
          align: 'center',
          width: '10%'
        },
        {
          title: '菜单类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          align: 'center',
          width: '10%'
        },
        {
          title: '权限标识',
          dataIndex: 'permission',
          ellipsis: true,
          align: 'center',
          width: '20%'
        },
        {
          title: '菜单路径',
          dataIndex: 'url',
          ellipsis: true,
          align: 'center',
          width: '20%'
        },
        {
          title: '是否可见',
          dataIndex: 'visible',
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'visible' },
          width: '10%'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
          width: '20%'
        }
      ]
    }
  },
  filters: {
  },
  created () {
    this.getList()
  },
  computed: {

  },
  watch: {

  },
  methods: {
    /** 查询菜单列表 */
    getList () {
      this.loading = true
      listMenu(this.queryParam).then(response => {
          this.list = this.handleTree(response.data, 'id')
          this.loading = false
        }
      )
    },
    typeFormat (row) {
      // 0：菜单   1：按钮
      if (row.type === 0) {
        return '菜单'
      } else {
        return '按钮'
      }
    },
    visibleFormat (row) {
      // 0：显示   1：隐藏
      if (row.visible === 0) {
        return '显示'
      } else {
        return '隐藏'
      }
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.queryParam = {
        name: ''
      }
      this.handleQuery()
    },
    /** 查询菜单下拉树结构 */
    getTreeSelect () {
      this.menuOptions = []
      listMenuTree().then(response => {
        this.menuOptions.push(response.data)
      })
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const that = this
      const id = row.id
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + id + '的数据',
        onOk () {
          return deleteMenuById(id)
            .then(() => {
              that.getList()
              that.$message.success(
                '删除成功',
                3
              )
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>
