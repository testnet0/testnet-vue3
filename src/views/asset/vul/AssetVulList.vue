<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button>
        <!-- 高级查询 -->
        <super-query :config="superQueryConfig" @search="handleSuperQuery" />
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="(item, index) in dropdownItems" :key="index" @click="handleBatchRunChain(item.id, item.chainName)">
                <Icon :icon="item.icon" />
                {{ item.chainName }}
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >扫描任务
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined" />
                删除
              </a-menu-item>
              <a-menu-item key="2" @click="batchHandleChangeStatus">
                <Icon icon="ant-design:snippets-outlined" />
                修改状态
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
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #bodyCell="{ column, record, index, text }"> </template>
    </BasicTable>
    <!-- 表单区域 -->
    <AssetVulModal @register="registerModal" @success="handleSuccess" />
    <SelectVulStatusModel @register="registerStatusModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="cn.iotaa-assetVul" setup>
  import { ref, reactive, computed, unref, onMounted } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import AssetVulModal from './components/AssetVulModal.vue';
  import { columns, searchFormSchema, superQuerySchema } from './AssetVul.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './AssetVul.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useUserStore } from '/@/store/modules/user';
  import {batchRunChain, queryByAssetType, runChain} from '@/views/liteflow/chains/Chain.api';
  import {batchDeleteBySearch} from "@/views/asset/common/Common.api";
  import SelectAssetLabelModel from "@/views/asset/common/components/SelectAssetLabelModel.vue";
  import SelectVulStatusModel from "@/views/asset/vul/components/SelectVulStatusModel.vue";
  const queryParam = reactive<any>({});
  const queryObject = reactive<any>({});
  const checkedKeys = ref<Array<string | number>>([]);
  const userStore = useUserStore();
  //注册model
  const [registerModal, { openModal }] = useModal();

  const [registerStatusModal, { openModal: openStatusModal }] = useModal();

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '漏洞',
      api: list,
      columns,
      showIndexColumn: true,
      canResize: false,
      pagination: {
        pageSize: 10,
        pageSizeOptions: ['10', '50', '100', '500'],
      },
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
      beforeFetch: (params) => {
        Object.assign(queryObject, params);
        return Object.assign(params, queryParam);
      },
      defSort: {
        column: 'id',
        order: 'desc',
      },
    },
    exportConfig: {
      name: '漏洞',
      url: getExportUrl,
      params: queryParam,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const dropdownItems = ref([]);

  onMounted(() => {
    fetchDropdownItems();
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
   * 新增事件
   */
  function handleAdd() {
    openModal(true, {
      isUpdate: false,
      showFooter: true,
    });
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
    if (selectedRowKeys.value && selectedRowKeys.value.length > 0) {
      batchDelete({ ids: selectedRowKeys.value }, handleSuccess);
    } else {
      batchDeleteBySearch({ queryObject: { ...queryObject, ...queryParam }, assetType: 'vul' }, handleSuccess);
    }
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
    return [
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
    ];
  }
  /**
   * 批量运行
   */
  async function handleBatchRunChain(id, chainName) {
    batchRunChain(
      {
        queryObject: { ...queryObject, ...queryParam },
        chainId: id,
        chainName: chainName,
        data: rowSelection.selectedRows,
        assetType: 'vul',
      },
      handleSuccess
    );
  }
  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    const modifiedItems = dropdownItems.value.map((item) => ({
      label: item.chainName,
      icon: item.icon,
      popConfirm: {
        title: '确认运行' + item.chainName,
        confirm: handleRunChain.bind(null, item.id, item.chainName, record),
      },
    }));
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
      ...modifiedItems,
    ];
  }

  async function handleRunChain(id, chainName, record) {
    await runChain({ chainId: id, chainName: chainName, data: [record], assetType: 'vul' });
  }
  const fetchDropdownItems = async () => {
    try {
      const params = { assetType: 'vul' };
      dropdownItems.value = await queryByAssetType(params);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 批量修改状态
   */
  function batchHandleChangeStatus() {
    openStatusModal(true, {
      data: selectedRowKeys.value,
      queryObject: { ...queryObject, ...queryParam },
    });
  }
</script>

<style scoped></style>
