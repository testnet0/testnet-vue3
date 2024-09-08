<template>
  <BasicModal v-bind="$attrs" destroyOnClose :width="800" :show-ok-btn="false" :show-cancel-btn="false" title="运行日志" @cancel="handleCloseModal">
    <BasicTable @register="registerTable" :dataSource="Object.values(logData)">
      <template #expandedRowRender="{ record }">
        <span><JCodeEditor :value="record.message" /> </span>
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script lang="ts">
  export default {
    props: {
      logData: {
        type: Object,
        required: false,
      },
    },
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
  //定义表格列字段
  const columns: BasicColumn[] = [
    {
      title: '节点',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      customRender: (text) => {
        const date = new Date(Number(text.value));
        return date.toLocaleString(); // 根据本地时间格式返回日期字符串
      },
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      width: 200,
      resizable: true,
    },
  ];

  const { tableContext } = useListPage({
    designScope: 'basic-table-demo',
    tableProps: {
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
  const [registerTable] = tableContext;
</script>
<style lang="less" scoped></style>
