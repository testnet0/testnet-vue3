<template>
  <div class="dynamic-node" :style="nodeStyle">
    {{ config.name }}
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import type { NodeConfig } from '../types';

  interface Props {
    node?: {
      data?: {
        config?: NodeConfig;
      };
    };
  }

  const props = withDefaults(defineProps<Props>(), {
    node: () => ({
      data: {
        config: undefined,
      },
    }),
  });

  const config = computed(
    () =>
      props.node?.data?.config || {
        name: '',
        style: {
          backgroundColor: '#fff',
          borderColor: '#1890ff',
          textColor: '#333',
        },
      }
  );

  const nodeStyle = computed(() => ({
    backgroundColor: config.value.style?.backgroundColor || '#fff',
    borderColor: config.value.style?.borderColor || '#1890ff',
    color: config.value.style?.textColor || '#333',
  }));
</script>

<style scoped>
  .dynamic-node {
    width: 100%;
    height: 100%;
    padding: 8px 12px;
    border: 2px solid;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
  }
</style>
