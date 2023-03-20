<template>
  <el-input text maxlength="4" placeholder="请输入验证码" clearable autocomplete="off" v-bind="$attrs">
    <template #prefix>
      <el-icon class="el-input__icon"><ele-Message /></el-icon>
    </template>
    <template #suffix>
      <el-link type="primary" :underline="false" v-show="state.status !== 'countdown'" :disabled="state.status === 'countdown'" @click="onClick">{{
        state.status === 'ready' ? state.startText : state.endText
      }}</el-link>
      <el-countdown
        v-show="state.status === 'countdown'"
        :format="state.changeText"
        :value="state.countdown"
        value-style="font-size:var(--el-font-size-base);color:var(--el-color-primary)"
        @change="onChange"
      />
    </template>
  </el-input>
</template>

<script lang="ts" setup name="my-input-code">
import { reactive } from 'vue'

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
})

const state = reactive({
  status: 'ready',
  startText: props.startText,
  changeText: props.changeText,
  endText: props.endText,
  countdown: Date.now(),
})

const onClick = () => {
  state.status = 'countdown'
  state.countdown = Date.now() + (props.seconds + 1) * 1000
}

const onChange = (value: number) => {
  if (value < 1000) state.status = 'finish'
}
</script>

<style scoped lang="scss">
:deep(.el-statistic__content) {
  font-size: var(--el-font-size-base);
}
</style>
