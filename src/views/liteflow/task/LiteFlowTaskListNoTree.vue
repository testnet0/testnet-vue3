<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleCancel">
                <Icon icon="ant-design:delete-outlined" />
                取消运行
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #bodyCell="{ column, record, index, text }"> </template>
    </BasicTable>
    <!-- 表单区域 -->
    <LogModal :visible="logModalVisible" :log-id="logId" @close-modal="closeLogModalInModal()" />
    <LiteFlowSubTaskModal @register="registerModal" />
  </div>
</template>

<script lang="ts" name="org.jeecg.modules.cn.iotaa-script" setup>
  import { ref, reactive, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/src/components/Table';
  import { useModal } from '/src/components/Modal';
  import { useListPage } from '/src/hooks/system/useListPage';
  import { useUserStore } from '/src/store/modules/user';
  import {
    batchCancel,
    cancelTask,
    getSubTaskLog,
    noTreeList
  } from '@/views/liteflow/task/LiteFlowTask.api';
  import { FormSchema } from '@/components/Form';
  import {BasicColumn} from "@/components/Table";
  import LiteFlowSubTaskModal from "@/views/liteflow/task/components/LiteFlowSubTaskModal.vue";
  import LogModal from "@/views/liteflow/task/components/LogModal.vue";

  const logId = ref('');
  const queryParam = reactive<any>({});
  const checkedKeys = ref<Array<string | number>>([]);
  const userStore = useUserStore();
  const logModalVisible = ref(false);
  const logData = ref(null);
  //注册model
  const [registerModal, { openModal }] = useModal();
  const columns: BasicColumn[] = [
    {
      title: '任务',
      align: 'center',
      dataIndex: 'taskId_dictText',
      resizable: true,
    },
    {
      title: '执行节点',
      align: 'center',
      dataIndex: 'clientId_dictText',
      resizable: true,
    },
    {
      title: '任务状态',
      align: 'center',
      dataIndex: 'taskStatus_dictText',
      width: 100,
    },
    {
      title: '参数',
      align: 'center',
      dataIndex: 'config',
      resizable: true,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'updateTime',
    },
  ];
  const searchFormSchema: FormSchema[] = [
    {
      label: '任务',
      field: 'taskId',
      component: 'JDictSelectTag',
      componentProps: {
        dictCode: 'lite_flow_task,task_name,id',
      },
      //colProps: {span: 6},
    },
    {
      label: '节点',
      field: 'clientId',
      component: 'JDictSelectTag',
      componentProps: {
        dictCode: 'client,client_name,id',
      },
      //colProps: {span: 6},
    },
    {
      label: '任务状态',
      field: 'taskStatus',
      component: 'JDictSelectTag',
      componentProps: {
        dictCode: 'plugin_status',
      },
    },
  ];
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '脚本',
      api: noTreeList,
      columns,
      canResize: false,
      showIndexColumn: true,
      striped: true,
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 250,
        fixed: 'right',
      },
      beforeFetch: (params) => {
        return Object.assign(params, queryParam);
      },
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

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
  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }

  function closeLogModalInModal() {
    logData.value = null;
    logModalVisible.value = false; // 修改 logModalVisible 为 false
  }

  function handCancel(record) {
    cancelTask({ ids: record.id }, handleSuccess);
  }

  /**
   * 批量取消
   */
  async function batchHandleCancel() {
    await batchCancel({ ids: selectedRowKeys.value }, handleSuccess);
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
      // 调用 getPluginInstanceLog 方法来获取日志数据
      logId.value = record.id;
      logModalVisible.value = true;
    } catch (error) {
      console.error('查看日志操作失败', error);
    }
  }
</script>

<style scoped></style>
