<template>
  <div class="start-node">
    <div class="node-content"> 开始 </div>
  </div>
</template>

<script lang="ts" setup>
  // 开始节点不需要特殊逻辑
</script>

<style scoped>
  .start-node {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e6f7ff;
    border: 2px solid #1890ff;
    border-radius: 4px;
  }

  .node-content {
    font-size: 14px;
    color: #1890ff;
    font-weight: bold;
  }
</style>
