<template>
  <div class="p-4">
    <RadioButtonGroup :options="options" v-model:value="selectedComponent" placeholder="选择组件" />
    <component :is="selectedComponent" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import LiteFlowTaskListTree from '@/views/liteflow/task/LiteFlowTaskListTree.vue';
  import LiteFlowTaskListNoTree from '@/views/liteflow/task/LiteFlowTaskListNoTree.vue';
  import RadioButtonGroup from '@/components/Form/src/components/RadioButtonGroup.vue';

  export default defineComponent({
    components: {
      RadioButtonGroup,
      LiteFlowTaskListTree,
      LiteFlowTaskListNoTree,
    },
    setup() {
      const selectedComponent = ref('LiteFlowTaskListTree'); // 初始时显示树形组件

      const options = [
        { label: '折叠展示', value: 'LiteFlowTaskListTree' },
        { label: '非折叠展示', value: 'LiteFlowTaskListNoTree' },
      ];

      return { options, selectedComponent };
    },
  });
</script>
<style lang="less" scoped>
  .box {
    width: 150px;
    height: 150px;
    margin-top: 20px;
    background: pink;
  }
</style>
