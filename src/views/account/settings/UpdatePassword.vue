<template>
  <a-modal
    :title="title"
    :visible="open"
    :confirm-loading="submitLoading"
    @ok="submitForm"
    @cancel="cancel"
  >
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item has-feedback label="新密码" prop="newPassword">
        <a-input-password v-model="form.newPassword" placeholder="请输入新密码" :maxLength="20" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="确认密码" prop="confirmPassword">
        <a-input-password v-model="form.confirmPassword" placeholder="请确认密码" :maxLength="20" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import { updatePassword } from '@/api/v1/user'
import { mapGetters } from 'vuex'
export default {
  props: {
  },
  data () {
    const validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (!/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){5,20}$/.test(value)) {
        callback(new Error('请输入5-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种'))
      } else {
        if (this.form.confirmPassword !== '') {
          this.$refs.form.validateField('confirmPassword')
        }
        callback()
      }
    }
    const validateConfirmPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码确认'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      submitLoading: false,
      title: '重置密码',
      open: false,
      childrenDrawer: false,
      formLayout: 'horizontal',
      form: {
        newPassword: undefined,
        confirmPassword: undefined
      },
      rules: {
        newPassword: [
          { required: true, validator: validateNewPass, trigger: 'change' }
        ],
        confirmPassword: [
          { required: true, validator: validateConfirmPass, trigger: 'change' }
        ]
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      }
    }
  },
  computed: {
  ...mapGetters(['id'])
  },
  methods: {
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset () {
      this.form = {
        newPassword: undefined,
        confirmPassword: undefined
      }
    },
    handleUpdatePwd () {
      this.open = true
    },
    /** 重置密码按钮操作 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          const data = { id: this.id, password: this.form.newPassword }
          updatePassword(data).then(() => {
            this.$message.success(
              '修改成功',
              3
            )
            this.open = false
          }).finally(() => {
            this.submitLoading = false
            this.reset()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
