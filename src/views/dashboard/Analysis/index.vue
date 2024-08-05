<template>
  <PageWrapper>
    <IndexAssetCard />
    <IndexFlowCard />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import IndexAssetCard from '@/views/dashboard/Analysis/homePage/IndexAssetCard.vue';
  import IndexFlowCard from '@/views/dashboard/Analysis/homePage/IndexFlowCard.vue';
</script>
