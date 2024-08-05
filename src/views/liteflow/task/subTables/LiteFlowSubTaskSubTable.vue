<template>
  <div>
    <!--引用表格-->
    <BasicTable
      bordered
      size="middle"
      :loading="loading"
      rowKey="id"
      :canResize="false"
      :columns="liteFlowSubTaskColumns"
      :dataSource="dataSource"
      :pagination="{
        total: total,
        current: current,
        pageSize: currentPageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
      }"
      :action-column="{
        width: 200,
        fixed: 'right',
        title: '操作',
        dataIndex: 'action',
        slots: {
          customRender: 'action',
        },
      }"
      @change="onPageChange"
    >
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #bodyCell="{ column, record, index, text }"> </template>
    </BasicTable>
    <LogModal :visible="logModalVisible" :log-id="logId" @close-modal="closeLogModalInModal()" />
    <LiteFlowSubTaskModal @register="registerModal" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, watchEffect } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { liteFlowSubTaskColumns } from '../LiteFlowTask.data';
  import { cancelTask, liteFlowSubTaskList } from '../LiteFlowTask.api';
  import { useModal } from '@/components/Modal';
  import LogModal from '@/views/liteflow/task/components/LogModal.vue';
  import LiteFlowSubTaskModal from '@/views/liteflow/task/components/LiteFlowSubTaskModal.vue';


  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  let logModalVisible = false;
  const logId = ref('');
  const [registerModal, { openModal }] = useModal();

  const onPageChange = (pagination) => {
    loadData(props.id, pagination.current, pagination.pageSize);
  };
  const loading = ref(false);
  const dataSource = ref([]);
  const current = ref(1);
  const total = ref(0);
  const currentPageSize = ref(10);

  watchEffect(() => {
    props.id && loadData(props.id, 1, 10);
  });

  function loadData(id, pageNum, pageSize) {
    dataSource.value = [];
    loading.value = true;
    liteFlowSubTaskList({ id: id, pageNum: pageNum, pageSize: pageSize })
      .then((res) => {
        if (res.success) {
          total.value = res.result.total;
          current.value = res.result.current;
          currentPageSize.value = res.result.size;
          dataSource.value = res.result.records;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }

  function closeLogModalInModal() {
    logModalVisible = false; // 修改 logModalVisible 为 false
    logId.value = '';
  }

  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }

  function handCancel(record) {
    cancelTask({ ids: record.id }, loadData(props.id, 1, 10));
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    if (!record || typeof record.taskStatus !== 'string') {
      return [];
    }
    const common = [
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
      {
        label: '查看日志',
        onClick: viewLog.bind(null, record),
      },
    ];
    if (record.taskStatus === 'PENDING' || record.taskStatus === 'RUNNING') {
      return [
        ...common,
        {
          label: '取消',
          popConfirm: {
            title: '是否确认取消',
            confirm: handCancel.bind(null, record),
            placement: 'topLeft',
          },
        },
      ];
    } else {
      return [...common];
    }
  }

  // 在 viewLog 中调用 getPluginInstanceLog 并将结果传递给 logData
  async function viewLog(record) {
    try {
      logId.value = record.id;
      logModalVisible = true;
    } catch (error) {
      console.error('查看日志操作失败', error);
    }
  }
</script>
