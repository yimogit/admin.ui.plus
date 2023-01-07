<template>
  <div>
    <el-dialog v-model="state.showDialog" :title="title" draggable width="600px">
      <div class="mb15">
        <el-input v-model="state.fileDirectory" placeholder="文件目录" clearable />
        <div class="mt5">
          <el-alert class="my-el-alert" title="目录不填则默认使用本地上传格式：upload/yyyy/MM/dd" type="info" :closable="false" />
        </div>
      </div>
      <div>
        <el-upload
          ref="uploadRef"
          :action="uploadAction"
          :headers="uploadHeaders"
          :data="{ fileDirectory: state.fileDirectory }"
          drag
          multiple
          :auto-upload="false"
          :on-success="onSuccess"
        >
          <el-icon class="el-icon--upload"><ele-UploadFilled /></el-icon>
          <div class="el-upload__text">拖拽上传或<em>点击上传</em></div>
          <!-- <template #tip>
            <div class="el-upload__tip"></div>
          </template> -->
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSure" size="default" :loading="state.sureLoading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { UploadFile, UploadFiles } from 'element-plus'
import { getToken } from '/@/api/admin/http-client'
import type { UploadInstance } from 'element-plus'
import eventBus from '/@/utils/mitt'

const uploadRef = ref<UploadInstance>()

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const state = reactive({
  showDialog: false,
  sureLoading: false,
  fileDirectory: '',
  fileList: [] as UploadFile[],
})

const uploadAction = computed(() => {
  return import.meta.env.VITE_API_URL + '/api/admin/file/upload-file'
})

const uploadHeaders = computed(() => {
  return { Authorization: 'Bearer ' + getToken() }
})

// 打开对话框
const open = async (row: any = {}) => {
  state.showDialog = true
}

// 上传成功
const onSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (response?.success) {
    eventBus.emit('refreshFile')
  }
}

// 取消
const onCancel = () => {
  state.showDialog = false
}

// 确定
const onSure = async () => {
  uploadRef.value!.submit()
}

defineExpose({
  open,
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'admin/file/upload',
})
</script>

<style scoped lang="scss">
.my-el-alert {
  border: none;
  padding-left: 5px;
  padding-right: 5px;
}
</style>
