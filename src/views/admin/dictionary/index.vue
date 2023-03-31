<template>
  <my-layout>
    <pane size="50" min-size="30" max-size="70">
      <dictionary-type @change="onChange"></dictionary-type>
    </pane>
    <pane>
      <dictionary ref="dictionaryRef"></dictionary>
    </pane>
  </my-layout>
</template>

<script lang="ts" setup name="admin/dict">
import { defineAsyncComponent, ref } from 'vue'
import { Pane } from 'splitpanes'
import { DictionaryTypeListOutput } from '/@/api/admin/data-contracts'

// 引入组件
const DictionaryType = defineAsyncComponent(() => import('./dictionary-type.vue'))
const Dictionary = defineAsyncComponent(() => import('./dictionary.vue'))
const MyLayout = defineAsyncComponent(() => import('/@/components/my-layout/index.vue'))

const dictionaryRef = ref()

const onChange = (data: DictionaryTypeListOutput) => {
  dictionaryRef.value?.refresh(data)
}
</script>

<style scoped lang="scss"></style>
