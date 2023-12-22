<template>
  <div>
    <el-dialog
      v-model="state.showDialog"
      destroy-on-close
      :title="title"
      draggable
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="600px"
    >
      <el-form :model="form" ref="formRef" size="default" label-width="80px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="任务标题" prop="topic" :rules="[{ required: true, message: '请输入任务标题', trigger: ['blur', 'change'] }]">
              <el-input v-model="form.topic" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="任务参数" prop="body">
              <el-input v-model="form.body" clearable type="textarea" rows="6" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="执行轮数" prop="round" :rules="[{ required: true, message: '请输入执行轮数', trigger: ['blur', 'change'] }]">
              <el-input-number v-model="form.round" :min="-1" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="定时类型" prop="interval" :rules="[{ required: true, message: '请选择定时类型', trigger: ['change'] }]">
              <el-select v-model="form.interval" placeholder="请选择定时类型" style="width: 150px">
                <el-option v-for="item in state.intervals" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item
              label="定时参数"
              prop="intervalArgument"
              :rules="[{ required: true, message: '请输入定时参数', trigger: ['blur', 'change'] }]"
            >
              <el-input v-model="form.intervalArgument" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSure" size="default" :loading="state.sureLoading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="admin/task/form">
import { reactive, toRefs, ref } from 'vue'
import { TaskUpdateInput } from '/@/api/admin/data-contracts'
import { TaskApi } from '/@/api/admin/Task'
import { cloneDeep } from 'lodash-es'
import eventBus from '/@/utils/mitt'

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const formRef = ref()
const state = reactive({
  showDialog: false,
  sureLoading: false,
  form: {} as TaskUpdateInput,
  intervals: [
    { label: '按秒触发', value: 1 },
    { label: '每天', value: 11 },
    { label: '每星期几', value: 12 },
    { label: '每月第几天', value: 13 },
    { label: 'Cron表达式', value: 21 },
  ],
})

const { form } = toRefs(state)

// 打开对话框
const open = async (row: TaskUpdateInput = { id: '' }) => {
  let formData = cloneDeep(row) as TaskUpdateInput
  if (row.id) {
    const res = await new TaskApi().get({ id: row.id }, { loading: true })

    if (res?.success) {
      formData = res.data as TaskUpdateInput
    }
  }

  state.form = formData
  state.showDialog = true
}

// 取消
const onCancel = () => {
  state.showDialog = false
}

// 确定
const onSure = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    state.sureLoading = true
    let res = {} as any
    if (state.form.id) {
      res = await new TaskApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new TaskApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }

    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshTask')
      state.showDialog = false
    }
  })
}

defineExpose({
  open,
})
</script>
