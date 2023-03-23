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
    <el-dialog ref="dialogRef" v-model="state.showDialog" class="my-captcha" title="请完成安全验证" draggable append-to-body width="380px">
      <MySlideCaptcha
        ref="slideCaptchaRef"
        :fail-tip="state.failTip"
        :success-tip="state.successTip"
        width="100%"
        height="auto"
        @refresh="onRefresh"
        @finish="onFinish"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="my-input-code">
import { ref, reactive, defineAsyncComponent } from 'vue'
import { CaptchaApi } from '/@/api/admin/Captcha'
import { isMobile } from '/@/utils/test'
import { ElMessage } from 'element-plus'

const MySlideCaptcha = defineAsyncComponent(() => import('/@/components/my-slide-captcha/index.vue'))

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

const slideCaptchaRef = ref()
const dialogRef = ref()

const state = reactive({
  status: 'ready',
  startText: props.startText,
  changeText: props.changeText,
  endText: props.endText,
  countdown: Date.now(),

  showDialog: false,
  requestId: '',
  failTip: '',
  successTip: '',
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

//刷新滑块验证码
const onRefresh = async () => {
  slideCaptchaRef.value.startRequestGenerate()
  const res = await new CaptchaApi().generate({ captchaId: state.requestId }).catch(() => {
    slideCaptchaRef.value.endRequestGenerate(null, null)
  })
  if (res?.success && res.data) {
    state.requestId = res.data.id || ''
    slideCaptchaRef.value.endRequestGenerate(res.data.backgroundImage, res.data.sliderImage)
  }
}

//验证滑块验证码
const onFinish = async (data: any) => {
  slideCaptchaRef.value.startRequestVerify()
  const res = await new CaptchaApi().check(data, { id: state.requestId }).catch(() => {
    state.failTip = '服务异常，请稍后重试'
    slideCaptchaRef.value.endRequestVerify(false)
  })
  if (res?.success && res.data) {
    let success = res.data.result === 0
    state.failTip = res.data.result == 1 ? '验证未通过，拖动滑块将悬浮图像正确合并' : '验证超时, 请重新操作'
    state.successTip = '验证通过'
    slideCaptchaRef.value.endRequestVerify(success)
    if (success) {
      state.showDialog = false
      startCountdown()
      //发送短信验证码
    } else {
      setTimeout(() => {
        onRefresh()
      }, 1000)
    }
  }
}

//获得验证码
const onGetCode = () => {
  //验证手机号
  if (!isMobile(props.mobile)) {
    ElMessage.warning({ message: '请输入正确的手机号码', grouping: true })
    return
  }

  state.showDialog = true
  //刷新验证码
  slideCaptchaRef.value?.handleRefresh()
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
