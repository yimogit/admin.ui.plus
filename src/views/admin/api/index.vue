<template>
  <div style="padding: 0px 0px 8px 8px">
    <el-row :gutter="8" style="width: 100%">
      <el-col :span="24" :xs="24">
        <el-card shadow="never" :body-style="{ paddingBottom: '0' }" style="margin-top: 8px">
          <el-form :model="state.filterModel" :inline="true">
            <el-form-item label="接口名称" prop="name">
              <el-input v-model="state.filterModel.name" placeholder="接口名称" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="ele-Search" @click="onQuery"> 查询 </el-button>
              <el-button v-auth="'api:admin:api:add'" type="primary" icon="ele-Plus" @click="onAdd"> 新增 </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="never" style="margin-top: 8px">
          <el-table
            :data="state.apiTreeData"
            style="width: 100%"
            v-loading="state.loading"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column prop="label" label="接口名称" min-width="120" show-overflow-tooltip />
            <el-table-column prop="path" label="接口地址" min-width="120" show-overflow-tooltip />
            <el-table-column prop="description" label="接口描述" min-width="120" show-overflow-tooltip />
            <el-table-column label="状态" width="80" align="center" show-overflow-tooltip>
              <template #default="{ row }">
                <el-tag type="success" v-if="row.enabled">启用</el-tag>
                <el-tag type="danger" v-else>禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right" header-align="center" align="center">
              <template #default="{ row }">
                <el-button v-auth="'api:admin:api:update'" icon="ele-EditPen" size="small" text type="primary" @click="onEdit(row)">编辑</el-button>
                <el-button v-auth="'api:admin:api:softdelete'" icon="ele-Delete" size="small" text type="danger" @click="onDelete(row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <api-form ref="apiFormRef" :title="state.apiFormTitle" :api-tree-data="state.formApiTreeData"></api-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, getCurrentInstance, onUnmounted, defineAsyncComponent } from 'vue'
import { ApiListOutput } from '/@/api/admin/data-contracts'
import { Api as ApiApi } from '/@/api/admin/Api'
import { listToTree } from '/@/utils/tree'
import { cloneDeep } from 'lodash-es'
import eventBus from '/@/utils/mitt'

// 引入组件
const ApiForm = defineAsyncComponent(() => import('./components/api-form.vue'))

const { proxy } = getCurrentInstance() as any

const apiFormRef = ref()

const state = reactive({
  loading: false,
  apiFormTitle: '',
  filterModel: {
    name: '',
  },
  apiTreeData: [] as Array<ApiListOutput>,
  formApiTreeData: [] as Array<ApiListOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.on('refreshApi', async () => {
    onQuery()
  })
})

onUnmounted(() => {
  eventBus.off('refreshApi')
})

const onQuery = async () => {
  state.loading = true
  const res = await new ApiApi().getList()
  if (res.data && res.data.length > 0) {
    state.apiTreeData = listToTree(cloneDeep(res.data))
    state.formApiTreeData = listToTree(res.data.filter((a) => a.parentId === 0))
  } else {
    state.apiTreeData = []
    state.formApiTreeData = []
  }
  state.loading = false
}

const onAdd = () => {
  state.apiFormTitle = '新增接口'
  apiFormRef.value.open()
}

const onEdit = (row: ApiListOutput) => {
  state.apiFormTitle = '编辑接口'
  apiFormRef.value.open(row)
}

const onDelete = (row: ApiListOutput) => {
  proxy.$modal
    .confirmDelete(`确定要删除接口【${row.label}】?`)
    .then(async () => {
      await new ApiApi().delete({ id: row.id }, { loading: true })
      onQuery()
    })
    .catch(() => {})
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'admin/api',
})
</script>

<style scoped lang="scss"></style>
