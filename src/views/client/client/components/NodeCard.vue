<template>
  <a-card :loading="loading" :body-style="{ padding: '16px 20px' }" :bordered="true" class="node-card">
    <div class="node-card-header">
      <div class="flag">
        <img :src="flag" alt="Country Flag" />
      </div>
      <div class="meta">
        <span class="node-card-title">{{ title }}</span>
        <span class="node-card-subtitle">{{ country }}</span>
      </div>
    </div>
    <div class="node-card-content">
      <p class="usage">
        <span class="label">内存占用:</span>
        <span class="value">{{ memoryUsage }}%</span>
      </p>
      <p class="usage">
        <span class="label">CPU占用:</span>
        <span class="value">{{ cpuUsage }}%</span>
      </p>
      <p class="ip">
        <span class="label">公网IP:</span>
        <span class="value">{{ ip }}</span>
      </p>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  defineProps({
    title: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    flag: {
      type: String,
      default: '',
    },
    ip: {
      type: String,
      default: '',
    },
    memoryUsage: {
      type: Number,
      default: 0,
    },
    cpuUsage: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style lang="less" scoped>
  .node-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.3s,
      box-shadow 0.3s;
    margin-bottom: 16px;
    width: 240px; /* Smaller card width */
    height: 160px; /* Smaller card height */
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .node-card-header {
      display: flex;
      align-items: center;

      .flag {
        width: 32px;
        height: 20px;
        margin-right: 8px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .meta {
        display: flex;
        flex-direction: column;

        .node-card-title {
          font-size: 14px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.85);
        }

        .node-card-subtitle {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }

    .node-card-content {
      p {
        margin: 0;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
        display: flex;
        justify-content: space-between;

        .label {
          font-weight: 500;
        }

        .value {
          color: #52c41a;
        }
      }

      .ip {
        margin-top: 4px;

        .value {
          color: #1890ff;
        }
      }
    }
  }
</style>
