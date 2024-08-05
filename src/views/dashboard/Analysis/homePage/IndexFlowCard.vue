<template>
  <Card title="工作流" v-bind="$attrs">
    <a-card :loading="loading" :body-style="{ padding: '20px 24px 8px' }" :bordered="false" class="chart-card-placeholder" />
    <div class="cards-container">
      <ChartCard
        v-for="(item, index) in assetData"
        :key="item.title"
        :title="item.title"
        :total="item.totalCount"
        :href="item.href"
        :color="item.color"
        class="chart-card"
      >
        <template #action>
          <Icon :icon="item.icon" :color="item.color" :size="30" />
        </template>
        <template #footer> {{ item.desc }} </template>
      </ChartCard>
    </div>
  </Card>
</template>

<script setup>
  import ChartCard from '/@/components/chart/ChartCard.vue';
  import { ref } from 'vue';
  import { getScriptData } from '@/views/dashboard/Analysis/api';
  import { Card } from 'ant-design-vue';

  const loading = ref(false);

  const assetTypes = [
    {
      title: '任务',
      icon: 'mdi:clipboard-check-outline',
      color: '#673ab7',
      href: '/testnet/liteFlowTaskList',
    },
    {
      title: '节点',
      icon: 'mdi:server',
      color: '#ff9800',
      href: '/testnet/clientList',
    },
    {
      title: '脚本',
      icon: 'mdi:script-text-outline',
      color: '#4caf50',
      href: '/testnet/scriptList',
    },
    {
      title: '工作流',
      icon: 'mdi:workflow',
      color: '#03a9f4',
      href: '/testnet/chainList',
    },
    {
      title: '节点配置',
      icon: 'mdi:cog-outline',
      color: '#f44336',
      href: '/testnet/clientConfigList',
    },
  ];

  const assetData = ref([]);

  // 获取后端数据并结合前端定义的数据
  async function initAssetData() {
    loading.value = true;
    try {
      const res = await getScriptData(null);
      // 将后端数据与前端定义的数据结合
      assetData.value = assetTypes.map((type, index) => ({
        ...type,
        totalCount: res[index]?.count || 0,
        desc: res[index]?.desc || '',
      }));
    } catch (error) {
      console.error('获取资产数据失败:', error);
    } finally {
      loading.value = false;
    }
  }

  initAssetData();
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  .chart-card {
    transition: all 0.3s;
  }
</style>
