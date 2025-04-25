<template>
  <div class="end-node">
    <div class="node-content"> 结束 </div>
  </div>
</template>

<script lang="ts" setup>
  // 结束节点不需要特殊逻辑
</script>

<style scoped>
  .end-node {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff1f0;
    border: 2px solid #ff4d4f;
    border-radius: 4px;
  }

  .node-content {
    font-size: 14px;
    color: #ff4d4f;
    font-weight: bold;
  }
</style>
