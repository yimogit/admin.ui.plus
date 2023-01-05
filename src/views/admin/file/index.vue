<template>
  <div style="padding: 0px 0px 8px 8px">
    <el-card shadow="never" :body-style="{ paddingBottom: '0' }" style="margin-top: 8px">
      <el-form :model="state.filterModel" :inline="true">
        <el-form-item prop="name">
          <el-input v-model="state.filterModel.fileName" placeholder="文件名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="ele-Search" @click="onQuery"> 查询 </el-button>
          <el-button type="primary" icon="ele-Upload" @click="onUpload"> 上传 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" style="margin-top: 8px">
      <el-table v-loading="state.loading" :data="state.fileListData" row-key="id" style="width: 100%">
        <el-table-column prop="fileName" label="文件名" :formatter="formatterFileName" min-width="120" show-overflow-tooltip />
        <el-table-column prop="sizeFormat" label="大小" width="120" />
        <el-table-column prop="providerName" label="供应商" width="80" />
        <el-table-column prop="bucketName" label="存储桶" width="80" />
        <el-table-column prop="createdUserName" label="上传者" width="80" />
        <el-table-column prop="createdTime" label="更新时间" :formatter="formatterTime" width="100" />
        <el-table-column label="操作" width="180" fixed="right" header-align="center" align="center">
          <!-- <template #default="{ row }">
            
          </template> -->
        </el-table-column>
      </el-table>
      <div class="my-flex my-flex-end" style="margin-top: 20px">
        <el-pagination
          v-model:currentPage="state.pageInput.currentPage"
          v-model:page-size="state.pageInput.pageSize"
          :total="state.total"
          :page-sizes="[10, 20, 50, 100]"
          small
          background
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <file-upload ref="fileUploadRef" title="上传文件"></file-upload>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { PageInputFileGetPageDto, FileGetPageOutput } from '/@/api/admin/data-contracts'
import { FileApi } from '/@/api/admin/File'
import dayjs from 'dayjs'
import eventBus from '/@/utils/mitt'

const FileUpload = defineAsyncComponent(() => import('./components/file-upload.vue'))

const fileUploadRef = ref()

const state = reactive({
  loading: false,
  fileFormTitle: '',
  filterModel: {
    fileName: '',
  },
  total: 0,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
  } as PageInputFileGetPageDto,
  fileListData: [] as Array<FileGetPageOutput>,
  fileLogsTitle: '',
})

onMounted(() => {
  onQuery()
  eventBus.on('refreshFile', async () => {
    onQuery()
  })
})

onUnmounted(() => {
  eventBus.off('refreshFile')
})

const formatterFileName = (row: FileGetPageOutput, column: any, cellValue: any) => {
  return (row.fileName || '') + (row.extension || '')
}

const formatterTime = (row: FileGetPageOutput, column: any, cellValue: any) => {
  return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
}

const onQuery = async () => {
  state.loading = true
  const res = await new FileApi().getPage({ ...state.pageInput, filter: state.filterModel })

  state.fileListData = res?.data?.list ?? []
  state.total = res.data?.total ?? 0
  state.loading = false
}

const onSizeChange = (val: number) => {
  state.pageInput.pageSize = val
  onQuery()
}

const onCurrentChange = (val: number) => {
  state.pageInput.currentPage = val
  onQuery()
}

const onUpload = () => {
  fileUploadRef.value.open()
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'admin/file',
})
</script>

<style scoped lang="scss"></style>
