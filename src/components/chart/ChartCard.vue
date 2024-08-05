<template>
  <a-card :loading="loading" :body-style="{ padding: '20px 24px 8px' }" :bordered="false" class="chart-card">
    <router-link :to="href" class="card-link">
      <div class="chart-card-header">
        <div class="meta">
          <span class="chart-card-title">{{ title }}</span>
          <span class="chart-card-action">
            <slot name="action"></slot>
          </span>
        </div>
        <div class="total"
          ><span>{{ total }}</span></div
        >
      </div>
      <div class="chart-card-content">
        <slot></slot>
      </div>
      <div class="chart-card-footer">
        <slot name="footer"></slot>
      </div>
    </router-link>
  </a-card>
</template>

<script lang="ts" setup>
  defineProps({
    title: {
      type: String,
      default: '',
    },
    total: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    href: {
      type: String,
      default: '',
    },
  });
</script>

<style lang="less" scoped>
  .chart-card {
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-5px);
    }

    .chart-card-header {
      position: relative;
      overflow: hidden;
      width: 100%;

      .meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: rgba(0, 0, 0, 0.85);
        font-size: 16px;
        font-weight: 500;
      }

      .total {
        font-size: 28px;
        font-weight: bold;
        color: #1890ff;
        margin-top: 10px;
      }
    }

    .chart-card-footer {
      border-top: 1px solid #e8e8e8;
      padding-top: 12px;
      margin-top: 12px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }
  }
</style>
