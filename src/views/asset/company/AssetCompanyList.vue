<template>
  <div>
    <!--引用表格-->
    <BasicTable :rowSelection="rowSelection" @register="registerTable">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button preIcon="ant-design:plus-outlined" type="primary" @click="handleAdd"> 新增 </a-button>
        <a-button preIcon="ant-design:export-outlined" type="primary" @click="onExportXlsx"> 导出 </a-button>
        <j-upload-button preIcon="ant-design:import-outlined" type="primary" @click="onImportXls"> 导入 </j-upload-button>
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
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <!--省市区字段回显插槽-->
      <template #pcaSlot="{ text }">
        {{ getAreaTextByCode(text) }}
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" preIcon="ant-design:download-outlined" size="small" type="primary" @click="downloadFile(text)">下载 </a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <AssetCompanyModal @register="registerModal" @success="handleSuccess" />
    <SelectAssetLabelModel @register="registerLabelModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="cn.iotaa-assetCompany" setup>
  import { Icon } from '/@/components/Icon';
  import { ref, onMounted, reactive } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import AssetCompanyModal from './components/AssetCompanyModal.vue';
  import { columns, searchFormSchema, superQuerySchema } from './AssetCompany.data';
  import { batchDelete, deleteOne, getExportUrl, getImportUrl, list } from './AssetCompany.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { batchRunChain, queryByAssetType, runChain } from '@/views/liteflow/chains/Chain.api';
  import { router } from '@/router';
  import { batchDeleteBySearch } from '@/views/asset/common/Common.api';
  import SelectAssetLabelModel from "@/views/asset/common/components/SelectAssetLabelModel.vue";

  const queryObject = reactive<any>({});
  const queryParam = reactive<any>({});
  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  const [registerLabelModal, { openModal: openLabelModal }] = useModal();

  const listNew = (params) => {
    const routeParams = router.currentRoute.value.query;
    const requestParams = {
      ...params,
      ...routeParams,
    };
    return list(requestParams);
  };
  //注册table数据
  const { prefixCls, tableContext, onExportXlsx, onImportXls } = useListPage({
    tableProps: {
      title: '公司',
      api: listNew,
      columns,
      canResize: false,
      showIndexColumn: true,
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
      name: '公司',
      url: getExportUrl,
      params: queryParam,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  const dropdownItems = ref([]);

  onMounted(() => {
    fetchDropdownItems();
  });

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
      batchDeleteBySearch({ queryObject, queryParam, assetType: 'company' }, handleSuccess);
    }
  }

  /**
   * 批量运行
   */
  async function handleBatchRunChain(id, chainName) {
    batchRunChain(
      { queryObject: queryObject, queryParam: queryParam, chainId: id, chainName: chainName, data: rowSelection.selectedRows, assetType: 'company' },
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
    await runChain({ chainId: id, chainName: chainName, data: [record], assetType: 'company' });
  }

  const fetchDropdownItems = async () => {
    try {
      const params = { assetType: 'company' };
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
      queryObject: queryObject,
      queryParam: queryParam,
      assetType: 'company',
    });
  }
</script>

<style scoped></style>
