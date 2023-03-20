<template>
  <el-form size="large" class="login-content-form">
    <el-form-item class="login-animation1">
      <el-input text :placeholder="$t('message.mobile.placeholder1')" v-model="state.ruleForm.userName" clearable autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon"><ele-Iphone /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2">
      <MyInputCode v-model="state.ruleForm.code"></MyInputCode>
    </el-form-item>
    <el-form-item class="login-animation3">
      <el-button round type="primary" v-waves class="login-content-submit">
        <span>{{ $t('message.mobile.btnText') }}</span>
      </el-button>
    </el-form-item>

    <div class="font12 mt30 login-animation4 login-msg">{{ $t('message.mobile.msgText') }}</div>
  </el-form>
</template>

<script lang="ts" setup name="loginMobile">
import { reactive, defineAsyncComponent } from 'vue'

const MyInputCode = defineAsyncComponent(() => import('/@/components/my-input-code/index.vue'))

// 定义变量内容
const state = reactive({
  ruleForm: {
    userName: '',
    code: '',
  },
})
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
