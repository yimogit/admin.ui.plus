<template>
  <my-layout>
    <pane size="50" min-size="30" max-size="70">
      <div class="my-flex-column w100 h100">
        <dictionary-type></dictionary-type>
      </div>
    </pane>
    <pane>
      <div class="my-flex-column w100 h100">
        <dictionary></dictionary>
      </div>
    </pane>
  </my-layout>
</template>

<script lang="ts" setup name="admin/dict">
import { defineAsyncComponent } from 'vue'
import { Pane } from 'splitpanes'

// 引入组件
const DictionaryType = defineAsyncComponent(() => import('./dictionary-type.vue'))
const Dictionary = defineAsyncComponent(() => import('./dictionary.vue'))
const MyLayout = defineAsyncComponent(() => import('/@/components/my-layout/index.vue'))
</script>

<style scoped lang="scss"></style>
