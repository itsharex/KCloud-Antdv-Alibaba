<template>
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="上级菜单" prop="pid">
        <a-tree-select
          v-model="form.pid"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="menuOptions"
          placeholder="请选择"
          :replaceFields="{children:'children', title:'name', key:'id', value: 'id' }"
          tree-default-expand-all
        >
        </a-tree-select>
      </a-form-model-item>
      <a-form-model-item label="菜单类型" prop="type">
        <a-radio-group v-model="form.type" button-style="solid">
          <a-radio-button value="0">菜单</a-radio-button>
          <a-radio-button value="1">按钮</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="菜单图标" prop="icon">
        <a-space size="large">
          <a-icon :component="allIcon[form.icon + 'Icon']" v-if="form.icon && allIcon[form.icon + 'Icon']"/>
          <a-icon :type="form.icon" v-if="form.icon && !allIcon[form.icon + 'Icon']"/>
          <a-button type="dashed" @click="selectIcon">
            选择图标
          </a-button>
          <a @click="cancelSelectIcon" v-if="iconVisible" style="margin-left: 8px">
            收起
            <a-icon type="up"/>
          </a>
        </a-space>
      </a-form-model-item>
      <a-card :body-style="{padding: '10px 20px'}" :bordered="false" v-if="iconVisible">
        <icon-selector v-model="form.icon" @change="handleIconChange" :svgIcons="iconList" :allIcon="allIcon"/>
      </a-card>
      <a-form-model-item label="菜单名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="菜单排序" prop="sort">
        <a-input-number v-model="form.sort" :min="1" :max="9999" style="width: 100%" />
      </a-form-model-item>
      <a-form-model-item prop="url">
        <span slot="label">
          菜单路径
          <a-tooltip>
            <template slot="title">
              访问的组件路径，如：`system/user/index`，默认在`views`目录下
            </template>
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-input v-model="form.url" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item prop="permission">
        <span slot="label">
          权限标识
          <a-tooltip>
            <template slot="title">
              控制器中定义的权限字符，如 sys:user:query
            </template>
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-input v-model="form.permission" placeholder="请输入" :maxLength="100" />
      </a-form-model-item>
      <a-form-model-item prop="visible" v-if="form.type === '0'">
        <span slot="label">
          状态
          <a-tooltip>
            <template slot="title">
              选择隐藏则路由将不会出现在侧边栏，也不能被访问
            </template>
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-radio-group v-model="form.visible" button-style="solid">
          <a-radio-button value="0" index='0'>显示</a-radio-button>
          <a-radio-button value="1" index='1'>隐藏</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <div class="bottom-control">
        <a-space>
          <a-button type="primary" :loading="submitLoading" @click="submitForm">
            保存
          </a-button>
          <a-button type="dashed" @click="cancel">
            取消
          </a-button>
        </a-space>
      </div>
    </a-form-model>
  </a-drawer>
</template>

<script>

import { getMenuById, insertMenu, updateMenu } from '@/api/v1/menu'
import allIcon from '@/core/icons'
import icons from '@/utils/requireIcons'
import IconSelector from '@/components/IconSelector'
import { getToken } from '@/api/v1/token'
export default {
  name: 'CreateForm',
  props: {
    menuOptions: {
      type: Array,
      required: true
    }
  },
  components: {
    IconSelector
  },
  data () {
    return {
      accessToken: '',
      allIcon,
      iconVisible: false,
      iconList: icons,
      submitLoading: false,
      formTitle: '',
      // 表单参数
      form: {
        id: '',
        pid: 0,
        name: '',
        icon: '',
        type: '0',
        sort: 1,
        visible: '0',
        url: '',
        permission: ''
      },
      open: false,
      rules: {
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '菜单路径不能为空', trigger: 'blur' }],
        permission: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }],
        visible: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        icon: [{ required: true, message: '请选择图标', trigger: 'blur' }]
      }
    }
  },
  filters: {
  },
  created () {
  },
  computed: {
  },
  watch: {
  },
  methods: {
    token () {
      getToken().then(res => {
        this.accessToken = res.data.token
      })
    },
    onClose () {
      this.open = false
      this.iconVisible = false
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.iconVisible = false
      this.reset()
    },
    // 表单重置
    reset () {
      this.form = {
        id: '',
        pid: 0,
        name: '',
        icon: '',
        type: '0',
        sort: 1,
        url: '',
        visible: '0',
        permission: ''
      }
    },
     /** 新增按钮操作 */
    handleAdd (row) {
      this.reset()
      this.token()
      this.$emit('select-tree')
      if (row != null && row.id) {
        this.form.pid = row.id
      } else {
        this.form.pid = 0
      }
      this.open = true
      this.formTitle = '菜单新增'
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset()
      this.$emit('select-tree')
      getMenuById(row.id).then(response => {
        this.form = response.data
        this.form.type = '' + response.data.type
        this.form.visible = '' + response.data.visible
        this.open = true
        this.formTitle = '菜单修改'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          if (this.form.id !== '') {
            const data = { menuCO: this.form }
            updateMenu(data).then(() => {
              this.$message.success(
                '修改成功',
                3
              )
              this.open = false
              this.iconVisible = false
              this.$emit('ok')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            const data = { menuCO: this.form }
            insertMenu(data, this.accessToken).then(() => {
              this.$message.success(
                '新增成功',
                3
              )
              this.open = false
              this.iconVisible = false
              this.$emit('ok')
            }).finally(() => {
              this.submitLoading = false
            })
          }
        } else {
          return false
        }
      })
    },
    handleIconChange (icon) {
      this.iconVisible = false
      this.form.icon = icon
    },
    selectIcon () {
      this.iconVisible = !this.iconVisible
    },
    cancelSelectIcon () {
      this.iconVisible = false
    }
  }
}
</script>
