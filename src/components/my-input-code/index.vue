<template>
  <div class="w100">
    <el-input text maxlength="4" placeholder="请输入验证码" autocomplete="off" v-bind="$attrs">
      <template #prefix>
        <el-icon class="el-input__icon"><ele-Message /></el-icon>
      </template>
      <template #suffix>
        <el-link
          type="primary"
          :underline="false"
          v-show="state.status !== 'countdown'"
          :disabled="state.status === 'countdown'"
          @click.prevent.stop="onClick"
          >{{ state.status === 'ready' ? state.startText : state.endText }}</el-link
        >
        <el-countdown
          v-show="state.status === 'countdown'"
          :format="state.changeText"
          :value="state.countdown"
          value-style="font-size:var(--el-font-size-base);color:var(--el-color-primary)"
          @change="onChange"
        />
      </template>
    </el-input>
    <MyCaptchaDialog ref="myCaptchaDialogRef" v-model="state.showDialog" @ok="onOk" />
  </div>
</template>

<script lang="ts" setup name="my-input-code">
import { reactive, defineAsyncComponent, ref } from 'vue'
import { isMobile } from '/@/utils/test'
import { ElMessage } from 'element-plus'

const MyCaptchaDialog = defineAsyncComponent(() => import('/@/components/my-captcha/dialog.vue'))

const props = defineProps({
  seconds: {
    type: Number,
    default: 60,
  },
  startText: {
    type: String,
    default: '获取验证码',
  },
  changeText: {
    type: String,
    default: 's秒重新获取',
  },
  endText: {
    type: String,
    default: '重新获取',
  },
  mobile: {
    type: String,
    default: '',
  },
  validate: {
    type: Function,
    default: null,
  },
})

const myCaptchaDialogRef = ref()

const state = reactive({
  status: 'ready',
  startText: props.startText,
  changeText: props.changeText,
  endText: props.endText,
  countdown: Date.now(),

  showDialog: false,
  requestId: '',
})

const startCountdown = () => {
  state.status = 'countdown'
  state.countdown = Date.now() + (props.seconds + 1) * 1000
}

const onClick = () => {
  if (state.status !== 'countdown') {
    if (props.validate) {
      props.validate(onGetCode)
    } else {
      onGetCode()
    }
  }
}

const onChange = (value: number) => {
  if (value < 1000) state.status = 'finish'
}

//验证通过 data: any
const onOk = () => {
  state.showDialog = false
  startCountdown()
  //发送短信验证码
}

//获得验证码
const onGetCode = () => {
  //验证手机号
  if (!isMobile(props.mobile)) {
    ElMessage.warning({ message: '请输入正确的手机号码', grouping: true })
    return
  }

  state.showDialog = true
  //刷新滑块拼图
  myCaptchaDialogRef.value?.refresh()
}
</script>

<style scoped lang="scss">
:deep(.el-statistic__content) {
  font-size: var(--el-font-size-base);
}
</style>
<style lang="scss">
.my-captcha .el-dialog__body {
  padding-top: 10px;
}
.my-captcha .captcha__bar {
  border-color: var(--el-border-color) !important;
}
</style>
