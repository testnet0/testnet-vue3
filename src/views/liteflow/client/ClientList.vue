<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <!--        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>-->
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <!--        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button>-->
        <!--        <a-dropdown v-if="selectedRowKeys.length > 0">-->
        <!--          <template #overlay>-->
        <!--            <a-menu>-->
        <!--              <a-menu-item key="1" @click="batchHandleDelete">-->
        <!--                <Icon icon="ant-design:delete-outlined" />-->
        <!--                删除-->
        <!--              </a-menu-item>-->
        <!--            </a-menu>-->
        <!--          </template>-->
        <!--          <a-button-->
        <!--            >批量操作-->
        <!--            <Icon icon="mdi:chevron-down" />-->
        <!--          </a-button>-->
        <!--        </a-dropdown>-->
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getDropDownAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #bodyCell="{ column, record, index, text }"> </template>
    </BasicTable>
    <!-- 表单区域 -->
    <ClientModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="cn.iotaa-client" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/src/components/Table';
  import { useModal } from '/src/components/Modal';
  import { useListPage } from '/src/hooks/system/useListPage';
  import ClientModal from '@/views/liteflow/client/components/ClientModal.vue';
  import { columns, searchFormSchema } from './Client.data';
  import { list, deleteOne, getImportUrl, getExportUrl } from './Client.api';
  import { useUserStore } from '/src/store/modules/user';
  const checkedKeys = ref<Array<string | number>>([]);
  const userStore = useUserStore();
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '节点',
      api: list,
      columns,
      showIndexColumn: true,
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
        width: 150,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '节点',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ id: record.id }, handleSuccess);
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    if (record.status === 'N') {
      return [
        {
          label: '删除',
          popConfirm: {
            title: '是否确认删除',
            confirm: handleDelete.bind(null, record),
          },
        },
      ];
    } else {
      return [];
    }
  }
</script>

<style scoped></style>
