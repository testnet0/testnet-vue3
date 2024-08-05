<template>
  <a-row :class="['p-4', `${prefixCls}--box`]" type="flex" :gutter="10">
    <a-col :xl="8" :lg="24" :md="24" style="margin-bottom: 10px">
      <AssetApiLeftTree ref="leftTree" @select="onTreeSelect" @load-right-data="handleSuccess" />
    </a-col>
    <a-col :xl="16" :lg="24" :md="24" style="margin-bottom: 10px">
      <div style="height: 100%" :class="[`${prefixCls}`]">
        <!--引用表格-->
        <BasicTable @register="registerTable" :rowSelection="rowSelection">
          <template #post="{ text }">
            {{
              (text || '')
                .split(',')
                .map((t) => (positionInfo[t] ? positionInfo[t] : t))
                .join(',')
            }}
          </template>
          <!--插槽:table标题-->
          <template #tableTitle>
            <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
            <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
            <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button>
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
                </a-menu>
              </template>
              <a-button
                >批量操作
                <Icon icon="mdi:chevron-down" />
              </a-button>
            </a-dropdown>
          </template>
          <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
          </template>
        </BasicTable>
        <AssetApiModal @register="registerModal" @success="handleSuccess" />
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
  import { Icon } from '/@/components/Icon';
  import { onMounted, reactive, ref } from 'vue';
  import AssetApiLeftTree from './components/AssetApiLeftTree.vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import { columns, searchFormSchema } from './AssetApi.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './AssetApi.api';
  import { batchRunChain, queryByAssetType, runChain } from '@/views/liteflow/chains/Chain.api';
  import AssetApiModal from '@/views/asset/api/components/AssetApiModal.vue';
  import { superQuerySchema } from '@/views/asset/api/AssetApi.data';
  import {batchDeleteBySearch} from "@/views/asset/common/Common.api";

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

  // 给子组件定义一个ref变量
  const leftTree = ref();

  // 当前选中的pid
  const pid = ref('');
  const positionInfo = ref({});

  const queryParam = reactive<any>({});
  const queryObject = reactive<any>({});

  //字典model
  const [registerModal, { openModal }] = useModal();

  /**
   * 批量运行
   */
  async function handleBatchRunChain(id, chainName) {
    batchRunChain(
      { queryObject: queryObject, queryParam: queryParam, chainId: id, chainName: chainName, data: rowSelection.selectedRows, assetType: 'api' },
      handleSuccess
    );
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
    leftTree.value.loadRootTreeData();
  }
  // 列表页面公共参数、方法
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      api: list,
      columns,
      rowKey: 'id',
      showIndexColumn: true,
      formConfig: {
        schemas: searchFormSchema,
      },
      pagination: {
        pageSize: 10,
        pageSizeOptions: ['10', '50', '100', '500'],
      },
      canResize: true,
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
      defSort: {
        column: 'id',
        order: 'desc',
      },
      showTableSetting: false,
      // 请求之前对参数做处理
      beforeFetch: (params) => {
        params.pid = pid.value;
        Object.assign(queryObject, params);
        return Object.assign(params, queryParam);
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
  //注册table数据
  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
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
      batchDeleteBySearch({ queryObject, queryParam, assetType: 'api' }, handleSuccess);
    }
  }

  const dropdownItems = ref([]);
  // 高级查询配置
  // const superQueryConfig = reactive(superQuerySchema);

  onMounted(() => {
    fetchDropdownItems();
  });

  // 左侧树选择后触发
  function onTreeSelect(data) {
    pid.value = data.key;
    reload();
  }
  const fetchDropdownItems = async () => {
    try {
      const params = { assetType: 'api' };
      dropdownItems.value = await queryByAssetType(params);
    } catch (error) {
      console.error(error);
    }
  };
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
    await runChain({ chainId: id, chainName: chainName, data: [record], assetType: 'api' });
  }
</script>

<style lang="less">
  @import './index.less';
</style>
