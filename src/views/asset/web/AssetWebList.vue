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
              <a-menu-item key="2" @click="handleChangeLabels">
                <Icon icon="ant-design:snippets-outlined" />
                打标
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
    <AssetWebModal @register="registerModal" @success="handleSuccess" />
    <SelectAssetLabelModel @register="registerLabelModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="cn.iotaa-assetWeb" setup>
  import { ref, onMounted, unref, reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import AssetWebModal from './components/AssetWebModal.vue';
  import { columns, searchFormSchema, superQuerySchema } from './AssetWeb.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, getWebBody } from './AssetWeb.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useUserStore } from '/@/store/modules/user';
  import { batchRunChain, queryByAssetType, runChain } from '@/views/liteflow/chains/Chain.api';
  import { router } from '@/router';
  import {batchDeleteBySearch} from "@/views/asset/common/Common.api";
  import SelectAssetLabelModel from "@/views/asset/common/components/SelectAssetLabelModel.vue";
  const queryParam = reactive<any>({});
  const queryObject = reactive<any>({});
  const checkedKeys = ref<Array<string | number>>([]);
  const userStore = useUserStore();
  //注册model
  const [registerModal, { openModal }] = useModal();
  const [registerLabelModal, { openModal: openLabelModal }] = useModal();

  const listWeb = (params) => {
    const routeParams = router.currentRoute.value.query;
    const requestParams = {
      ...params,
      ...routeParams,
    };
    return list(requestParams);
  };
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: 'WEB服务',
      api: listWeb,
      columns,
      showIndexColumn: true,
      pagination: {
        pageSize: 10,
        pageSizeOptions: ['10', '50', '100', '500'],
      },
      // 斑马纹
      striped: true,
      canResize: true,
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
      name: 'WEB服务',
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
  const dropdownItems = ref([]);

  onMounted(() => {
    fetchDropdownItems();
  });
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
  async function handleDetail(record: Recordable) {
    // const result = await getWebBody({ id: record.portId });
    // record.body = result ? result.body : '';
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
      batchDeleteBySearch({ queryObject: { ...queryObject, ...queryParam }, assetType: 'web' }, handleSuccess);
    }
  }

  /**
   * 批量运行
   */
  async function handleBatchRunChain(id, chainName) {
    await batchRunChain(
      { queryObject: { ...queryObject, ...queryParam }, chainId: id, chainName: chainName, data: rowSelection.selectedRows, assetType: 'web' },
      handleSuccess
    );
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
        },
      },
      ...modifiedItems,
    ];
  }

  async function handleRunChain(id, chainName, record) {
    await runChain({ chainId: id, chainName: chainName, data: [record], assetType: 'web' });
  }

  const fetchDropdownItems = async () => {
    try {
      const params = { assetType: 'web' };
      dropdownItems.value = await queryByAssetType(params);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 批量打标
   */
  function handleChangeLabels() {
    openLabelModal(true, {
      data: selectedRowKeys.value,
      queryObject: { ...queryObject, ...queryParam },
      assetType: 'web',
    });
  }
</script>

<style scoped></style>
