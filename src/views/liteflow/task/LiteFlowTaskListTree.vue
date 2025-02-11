<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <!-- 内嵌table区域 begin -->
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="子任务" key="liteFlowSubTask" forceRender>
            <liteFlowSubTaskSubTable :id="expandedRowKeys[0]" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <!-- 内嵌table区域 end -->
      <!--插槽:table标题-->
      <template #tableTitle>
        <!--        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>-->
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <!--        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button>-->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined" />
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
        <!-- 高级查询 -->
        <super-query :config="superQueryConfig" @search="handleSuperQuery" />
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :drop-down-actions="getDropDownAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #bodyCell="{ column, record, index, text }"> </template>
    </BasicTable>
    <!-- 表单区域 -->
    <LiteFlowTaskModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="testnet-liteFlowTask" setup>
  import { ref, reactive, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import LiteFlowTaskModal from './components/LiteFlowTaskModal.vue';
  import LiteFlowSubTaskSubTable from './subTables/LiteFlowSubTaskSubTable.vue';
  import { columns, searchFormSchema, superQuerySchema } from './LiteFlowTask.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, executeAgain, stopTask, deleteByTask } from './LiteFlowTask.api';
  import { useUserStore } from '/@/store/modules/user';

  const queryParam = reactive<any>({});
  // 展开key
  const expandedRowKeys = ref<any[]>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  const userStore = useUserStore();

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '扫描任务表',
      api: list,
      columns,
      canResize: false,
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 300,
        fixed: 'right',
      },
      defSort: {
        column: 'id',
        order: 'desc',
      },
      beforeFetch: (params) => {
        return Object.assign(params, queryParam);
      },
    },
    exportConfig: {
      name: '扫描任务表',
      url: getExportUrl,
      params: queryParam,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  // 高级查询配置
  const superQueryConfig = reactive(superQuerySchema);

  /**
   * 高级查询事件
   */
  function handleSuperQuery(params) {
    Object.keys(params).map((k) => {
      queryParam[k] = params[k];
    });
    reload();
  }

  /**
   * 展开事件
   * */
  function handleExpand(expanded, record) {
    expandedRowKeys.value = [];
    if (expanded === true) {
      expandedRowKeys.value.push(record.id);
    }
  }

  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
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
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ id: record.id }, handleSuccess);
  }
  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDelete({ ids: selectedRowKeys.value }, handleSuccess);
  }

  /**
   * 删除事件
   */
  async function handleDeleteByTask(record) {
    await deleteByTask({ id: record.id }, handleSuccess);
  }

  /**
   * 再次执行
   */
  async function handleExecuteAgain(record) {
    await executeAgain({ id: record.id, failed: false }, handleSuccess);
    expandedRowKeys.value = [];
  }

  /**
   * 再次执行失败任务
   */
  async function handleExecuteFailedAgain(record) {
    await executeAgain({ id: record.id, failed: true }, handleSuccess);
    expandedRowKeys.value = [];
  }

  /**
   * 停止
   */
  async function handleStop(record) {
    await stopTask({ id: record.id }, handleSuccess);
    expandedRowKeys.value = [];
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    const detail = [
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
    ];
    if (record.unFinishedChain == 0) {
      return [
        {
          label: '再次执行',
          popConfirm: {
            title: '是否确认重复执行？',
            confirm: handleExecuteAgain.bind(null, record),
            placement: 'topLeft',
          },
        },
        {
          label: '失败重试',
          popConfirm: {
            title: '失败任务重新执行？',
            confirm: handleExecuteFailedAgain.bind(null, record),
            placement: 'topLeft',
          },
        },
        ...detail,
      ];
    } else {
      return [
        {
          label: '停止',
          popConfirm: {
            title: '是否确认停止？',
            confirm: handleStop.bind(null, record),
            placement: 'topLeft',
          },
        },
        ...detail,
      ];
    }
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
          placement: 'topLeft',
        },
      },
      {
        label: '清理任务关联资产',
        popConfirm: {
          title: '是否确认删除扫描任务关联的所有资产',
          confirm: handleDeleteByTask.bind(null, record),
          placement: 'topLeft',
        },
      },
    ];
  }
</script>

<style scoped>
  :deep(.ant-picker),
  :deep(.ant-input-number) {
    width: 100%;
  }
</style>
