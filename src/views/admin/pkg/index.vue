<template>
  <my-layout>
    <pane size="50" min-size="30" max-size="70">
      <div class="my-flex-column w100 h100">
        <el-card class="mt8" shadow="never" :body-style="{ paddingBottom: '0' }">
          <el-form :inline="true" @submit.stop.prevent>
            <el-form-item label="套餐名称">
              <el-input v-model="state.filter.pkgName" placeholder="套餐名称" @keyup.enter="onQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="ele-Search" @click="onQuery"> 查询 </el-button>
              <el-button v-auth="'api:admin:pkg:add'" type="primary" icon="ele-Plus" @click="onAdd"> 新增 </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="my-fill mt8" shadow="never">
          <el-table
            ref="pkgTableRef"
            v-loading="state.loading"
            :data="state.pkgTreeData"
            row-key="id"
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            highlight-current-row
            style="width: 100%"
            @current-change="onCurrentChange"
          >
            <el-table-column prop="name" label="套餐名称" min-width="120" show-overflow-tooltip />
            <el-table-column prop="sort" label="排序" width="80" align="center" show-overflow-tooltip />
            <el-table-column label="操作" width="100" fixed="right" header-align="center" align="center">
              <template #default="{ row }">
                <my-dropdown-more
                  v-auths="['api:admin:pkg:set-pkg-permissions', 'api:admin:pkg:update', 'api:admin:pkg:delete']"
                  style="margin-left: 0px"
                >
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-if="auth('api:admin:pkg:set-pkg-permissions')" @click="onSetPkgMenu(row)">菜单权限</el-dropdown-item>
                      <el-dropdown-item v-if="auth('api:admin:pkg:update')" @click="onEdit(row)">编辑套餐</el-dropdown-item>
                      <el-dropdown-item v-if="auth('api:admin:pkg:delete')" @click="onDelete(row)">删除套餐</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </my-dropdown-more>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </pane>
    <pane>
      <div class="my-flex-column w100 h100">
        <el-card class="mt8" shadow="never" :body-style="{ paddingBottom: '0' }">
          <el-form :inline="true" @submit.stop.prevent>
            <el-form-item label="租户名">
              <el-input v-model="state.filter.name" placeholder="租户名" @keyup.enter="onGetPkgTenantList" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="ele-Search" @click="onGetPkgTenantList"> 查询 </el-button>
              <el-button v-auth="'api:admin:pkg:add-pkg-tenant'" type="primary" icon="ele-Plus" @click="onAddTenant"> 添加租户 </el-button>
              <el-button v-auth="'api:admin:pkg:remove-pkg-tenant'" type="danger" icon="ele-Delete" @click="onRemoveTenant"> 移除租户 </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="my-fill mt8" shadow="never">
          <el-table
            ref="tenantTableRef"
            v-loading="state.tenantListLoading"
            :data="state.tenantListData"
            row-key="id"
            style="width: 100%"
            @row-click="onTenantRowClick"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="租户名" min-width="120" show-overflow-tooltip />
            <el-table-column prop="code" label="租户编码" min-width="120" show-overflow-tooltip />
          </el-table>
        </el-card>
      </div>
    </pane>

    <pkg-form ref="pkgFormRef" :title="state.pkgFormTitle" :pkg-tree-data="state.pkgFormTreeData"></pkg-form>
    <tenant-select
      ref="tenantSelectRef"
      :title="`添加【${state.pkgName}】租户`"
      multiple
      :sure-loading="state.sureLoading"
      @sure="onSureTenant"
    ></tenant-select>
    <set-pkg-menu ref="setPkgMenuRef"></set-pkg-menu>
  </my-layout>
</template>

<script lang="ts" setup name="admin/pkg">
import { ref, reactive, onMounted, getCurrentInstance, onBeforeMount, nextTick, defineAsyncComponent } from 'vue'
import { PkgGetListOutput, PkgGetPkgTenantListOutput, PkgGetPageOutput, PkgAddPkgTenantListInput } from '/@/api/admin/data-contracts'
import { PkgApi } from '/@/api/admin/Pkg'
import { listToTree, filterTree } from '/@/utils/tree'
import { ElTable } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import eventBus from '/@/utils/mitt'
import { auth } from '/@/utils/authFunction'
import { Pane } from 'splitpanes'

// 引入组件
const PkgForm = defineAsyncComponent(() => import('./components/pkg-form.vue'))
const SetPkgMenu = defineAsyncComponent(() => import('./components/set-pkg-menu.vue'))
const TenantSelect = defineAsyncComponent(() => import('/@/views/admin/tenant/components/tenant-select.vue'))
const MyDropdownMore = defineAsyncComponent(() => import('/@/components/my-dropdown-more/index.vue'))
const MyLayout = defineAsyncComponent(() => import('/@/components/my-layout/index.vue'))

const { proxy } = getCurrentInstance() as any

const pkgTableRef = ref()
const pkgFormRef = ref()
const tenantTableRef = ref<InstanceType<typeof ElTable>>()
const tenantSelectRef = ref()
const setPkgMenuRef = ref()

const state = reactive({
  loading: false,
  tenantListLoading: false,
  sureLoading: false,
  pkgFormTitle: '',
  filter: {
    name: '',
    pkgName: '',
  },
  pkgTreeData: [] as any,
  pkgFormTreeData: [] as any,
  tenantListData: [] as PkgGetPkgTenantListOutput[],
  pkgId: undefined as number | undefined,
  pkgName: '' as string | null | undefined,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshPkg')
  eventBus.on('refreshPkg', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshPkg')
})

const onQuery = async () => {
  state.loading = true
  const res = await new PkgApi().getList().catch(() => {
    state.loading = false
  })
  if (res && res.data && res.data.length > 0) {
    state.pkgTreeData = filterTree(listToTree(cloneDeep(res.data)), state.filter.pkgName)
    state.pkgFormTreeData = listToTree(cloneDeep(res.data).filter((a) => a.parentId === 0))
    if (state.pkgTreeData.length > 0) {
      nextTick(() => {
        pkgTableRef.value!.setCurrentRow(state.pkgTreeData[0])
      })
    }
  } else {
    state.pkgTreeData = []
    state.pkgFormTreeData = []
  }

  state.loading = false
}

const onAdd = (row: PkgGetListOutput | undefined = undefined) => {
  state.pkgFormTitle = '新增套餐'
  pkgFormRef.value.open({ parentId: row?.id })
}

const onEdit = (row: PkgGetListOutput) => {
  state.pkgFormTitle = '编辑套餐'
  pkgFormRef.value.open(row)
}

const onDelete = (row: PkgGetListOutput) => {
  proxy.$modal
    .confirmDelete(`确定要删除套餐【${row.name}】?`)
    .then(async () => {
      await new PkgApi().delete({ id: row.id }, { loading: true })
      onQuery()
    })
    .catch(() => {})
}

const onGetPkgTenantList = async () => {
  state.tenantListLoading = true
  const res = await new PkgApi().getPkgTenantList({ PkgId: state.pkgId, TenantName: state.filter.name }).catch(() => {
    state.tenantListLoading = false
  })
  state.tenantListLoading = false
  if (res?.success) {
    if (res.data && res.data.length > 0) {
      state.tenantListData = res.data
    } else {
      state.tenantListData = []
    }
  }
}

const onCurrentChange = (currentRow: PkgGetListOutput) => {
  if (!currentRow) {
    return
  }

  state.pkgId = currentRow.id
  state.pkgName = currentRow.name
  onGetPkgTenantList()
}

const onTenantRowClick = (row: PkgGetPkgTenantListOutput) => {
  // TODO: improvement typing when refactor table
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  tenantTableRef.value!.toggleRowSelection(row, undefined)
}

const onAddTenant = () => {
  if (!((state.pkgId as number) > 0)) {
    proxy.$modal.msgWarning('请选择套餐')
    return
  }
  tenantSelectRef.value.open({ pkgId: state.pkgId })
}

const onRemoveTenant = () => {
  if (!((state.pkgId as number) > 0)) {
    proxy.$modal.msgWarning('请选择套餐')
    return
  }

  const selectionRows = tenantTableRef.value!.getSelectionRows() as PkgGetPageOutput[]

  if (!((selectionRows.length as number) > 0)) {
    proxy.$modal.msgWarning('请选择租户')
    return
  }

  proxy.$modal
    .confirm(`确定要移除吗?`)
    .then(async () => {
      const tenantIds = selectionRows?.map((a) => a.id)
      const input = { pkgId: state.pkgId, tenantIds } as PkgAddPkgTenantListInput
      await new PkgApi().removePkgTenant(input, { loading: true })
      onGetPkgTenantList()
    })
    .catch(() => {})
}

const onSureTenant = async (tenants: PkgGetPageOutput[]) => {
  if (!(tenants?.length > 0)) {
    tenantSelectRef.value.close()
    return
  }

  state.sureLoading = true
  const tenantIds = tenants?.map((a) => a.id)
  const input = { pkgId: state.pkgId, tenantIds } as PkgAddPkgTenantListInput
  await new PkgApi().addPkgTenant(input, { showSuccessMessage: true }).catch(() => {
    state.sureLoading = false
  })
  state.sureLoading = false
  tenantSelectRef.value.close()
  onGetPkgTenantList()
}

const onSetPkgMenu = (pkg: PkgGetListOutput) => {
  if (!((pkg?.id as number) > 0)) {
    proxy.$modal.msgWarning('请选择套餐')
    return
  }
  setPkgMenuRef.value.open(pkg)
}
</script>

<style scoped lang="scss"></style>
