<template>
  <div>
    <el-form ref="formRef" :model="state.ruleForm" size="large" class="login-content-form">
      <el-form-item
        class="login-animation1"
        prop="mobile"
        :rules="[
          { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
          { validator: testMobile, trigger: ['blur', 'change'] },
        ]"
      >
        <el-input
          ref="phoneRef"
          text
          :placeholder="$t('message.mobile.placeholder1')"
          maxlength="11"
          v-model="state.ruleForm.mobile"
          clearable
          autocomplete="off"
          @keyup.enter="onSignIn"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><ele-Iphone /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="login-animation2" prop="code" :rules="[{ required: true, message: '请输入短信验证码', trigger: ['blur', 'change'] }]">
        <MyInputCode v-model="state.ruleForm.code" @keyup.enter="onSignIn" :mobile="state.ruleForm.mobile" :validate="validate" />
      </el-form-item>
      <el-form-item class="login-animation3">
        <el-button round type="primary" v-waves class="login-content-submit" @click="onSignIn" :loading="state.loading.signIn">
          <span>{{ $t('message.mobile.btnText') }}</span>
        </el-button>
      </el-form-item>

      <div class="font12 mt30 login-animation4 login-msg">{{ $t('message.mobile.msgText') }}</div>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="loginMobile">
import { reactive, defineAsyncComponent, ref } from 'vue'
import { testMobile } from '/@/utils/test'

const MyInputCode = defineAsyncComponent(() => import('/@/components/my-input-code/index.vue'))

const formRef = ref()
const phoneRef = ref()
// 定义变量内容
const state = reactive({
  ruleForm: {
    mobile: '',
    code: '',
  },
  loading: {
    signIn: false,
  },
})

//验证手机号
const validate = (callback: Function) => {
  formRef.value.validateField('mobile', (isValid: boolean) => {
    if (!isValid) {
      phoneRef.value?.focus()
      return
    }
    callback?.()
  })
}

// 登录
const onSignIn = async () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
  })
}
</script>

<style scoped lang="scss">
.login-content-form {
  margin-top: 20px;
  @for $i from 1 through 4 {
    .login-animation#{$i} {
      opacity: 0;
      animation-name: error-num;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-delay: calc($i/10) + s;
    }
  }
  .login-content-code {
    width: 100%;
    padding: 0;
  }
  .login-content-submit {
    width: 100%;
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 15px;
  }
  .login-msg {
    color: var(--el-text-color-placeholder);
  }
}
</style>
