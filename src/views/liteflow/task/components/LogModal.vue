<template>
  <BasicModal v-bind="$attrs" destroyOnClose :width="800" :show-ok-btn="false" :show-cancel-btn="false" title="运行日志" @cancel="handleCloseModal">
    <div class="button-group">
      <a-button @click="toggleExpand" class="mr-2" :type="isExpanded ? 'default' : 'primary'">
        <span v-if="isExpanded">收起全部</span>
        <span v-else>展开全部</span>
      </a-button>
    </div>
    <BasicTable
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
      @register="register"
      :pagination="{
        total: total,
        current: current,
        pageSize: currentPageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
      }"
      @change="onPageChange"
    >
      <template #expandedRowRender="{ record }">
        <span><JCodeEditor :value="record.message" /> </span>
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script lang="ts">
  export default {
    emits: ['close-modal'],
    methods: {
      handleCloseModal() {
        this.$emit('close-modal'); // 触发 close-modal 事件
      },
    },
  };
</script>
<script lang="ts" setup>
  import { BasicModal } from '/@/components/Modal';
  import { BasicColumn, BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import JCodeEditor from '@/components/Form/src/jeecg/components/JCodeEditor.vue';
  import { getSubTaskLog } from '@/views/liteflow/task/LiteFlowTask.api';
  import { ref, watchEffect } from 'vue';

  const props = defineProps({
    logId: {
      type: String,
      default: '',
    },
  });

  const isExpanded = ref(false);

  function toggleExpand() {
    isExpanded.value = !isExpanded.value;
    if (isExpanded.value) {
      methods.expandAll();
    } else {
      methods.collapseAll();
    }
  }
  const loading = ref(false);
  const dataSource = ref([]);
  const current = ref(1);
  const total = ref(0);
  const currentPageSize = ref(10);

  watchEffect(() => {
    props.logId && loadData(props.logId, 1, 10);
  });

  const onPageChange = (pagination) => {
    console.log('onPageChange', pagination);
    loadData(props.logId, pagination.current, pagination.pageSize);
  };

  async function loadData(id, pageNum, pageSize) {
    dataSource.value = [];
    loading.value = true;
    getSubTaskLog({ id: id, pageNum: pageNum, pageSize: pageSize })
      .then((res) => {
        if (res) {
          console.log('res', res);
          total.value = res.total;
          current.value = res.current;
          currentPageSize.value = res.size;
          dataSource.value = res.records;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
  //定义表格列字段
  const columns: BasicColumn[] = [
    {
      title: '节点',
      dataIndex: 'clientName',
      key: 'clientName',
      width: 50,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 50,
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 80,
      customRender: (text) => {
        const date = new Date(Number(text.value));
        return date.toLocaleString(); // 根据本地时间格式返回日期字符串
      },
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      width: 200,
      resizable: true,
    },
  ];

  const { tableContext } = useListPage({
    designScope: 'basic-table-demo',
    tableProps: {
      isTreeTable: true,
      rowKey: 'timestamp',
      expandRowByClick: true,
      showActionColumn: false,
      showIndexColumn: true,
      pagination: true,
      showTableSetting: false,
      useSearchForm: false,
      columns: columns,
      size: 'small',
    },
  });
  // BasicTable绑定注册
  const [register, methods] = tableContext;

  async function expandAll() {
    methods.expandAll();
  }
  async function collapseAll() {
    methods.collapseAll();
  }
</script>
<style lang="less" scoped></style>
