<template>
  <Card v-bind="$attrs" title="资产">
    <!--    <template #title>-->
    <!--      <div class="title-container">-->
    <!--        <h3>资产</h3>-->
    <!--        <JRangeDate v-model="dateRange" />-->
    <!--      </div>-->
    <!--    </template>-->
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
        <!--        <template #footer> 今日新增 {{ item.todayIncreaseCount }} 个 </template>-->
        <template #footer>
          今日新增 <CountTo :color="'#409EFF'" :startVal="0" :endVal="item.todayIncreaseCount" :duration="2000" /> 个
        </template>
      </ChartCard>
    </div>
  </Card>
</template>

<script setup>
  import { CountTo } from '/@/components/CountTo/index';
  import ChartCard from '/@/components/chart/ChartCard.vue';
  import { ref } from 'vue';
  import { getAssetData } from '@/views/dashboard/Analysis/api';
  import { Card } from 'ant-design-vue';

  const loading = ref(false);

  // 前端定义资产类型
  const assetTypes = [
    {
      title: '域名',
      icon: 'mdi:domain',
      color: '#4caf50',
      href: '/testnet/assetDomainList',
    },
    {
      title: '子域名',
      icon: 'icon-park:web-page',
      color: '#2196f3',
      href: '/testnet/assetSubDomainList',
    },
    {
      title: 'IP',
      icon: 'mdi:ip-outline',
      color: '#073de8',
      href: '/testnet/assetIpList',
    },
    {
      title: '端口',
      icon: 'mdi:lan-connect',
      color: '#ff5722',
      href: '/testnet/assetPortList',
    },
    {
      title: 'Web',
      icon: 'mdi:web',
      color: '#ff9800',
      href: '/testnet/assetWebList',
    },
    {
      title: '漏洞',
      icon: 'mdi:bug-outline',
      color: '#f44336',
      href: '/testnet/assetVulList',
    },
    {
      title: 'API',
      icon: 'mdi:api',
      color: '#9c27b0',
      href: '/testnet/assetApiList',
    },
    {
      title: '公司',
      icon: 'mdi:company',
      color: '#009688',
      href: '/testnet/assetCompanyList',
    },
  ];

  const assetData = ref([]);

  // 获取后端数据并结合前端定义的数据
  async function initAssetData() {
    loading.value = true;
    try {
      const res = await getAssetData(null);
      // 将后端数据与前端定义的数据结合
      assetData.value = assetTypes.map((type, index) => ({
        ...type,
        totalCount: res[index]?.totalCount || 0,
        todayIncreaseCount: res[index]?.todayIncreaseCount || 0,
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

  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(51, 51, 51, 0.88);
  }
</style>
