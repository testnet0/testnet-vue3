<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:import-outlined" @click="handleOneKeyImport"> 一键导入</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="handelBatchImport">
                <Icon icon="ant-design:delete-outlined" />
                导入
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
      </template>

      <!--字段回显插槽-->
      <template #bodyCell="{ column, record, index, text }"></template>
    </BasicTable>
    <!-- 表单区域 -->
    <AssetImportModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script setup lang="ts">
  import { BasicColumn, BasicTable, FormSchema } from '@/components/Table';
  import { useModal } from '@/components/Modal';
  import { useListPage } from '@/hooks/system/useListPage';
  import { search } from '@/views/asset/search/AssetSearch.api';
  import AssetImportModal from '@/views/asset/search/components/AssetImportModal.vue';
  import { h, reactive, ref } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { router } from '@/router';
  import { collectKeyword, searchAutoComplete } from '@/views/asset/search_keyword/SearchEngineKeyword.api';

  const [registerModal, { openModal }] = useModal();
  const queryParam = reactive<any>({});
  const pagination = reactive({ pageSize: 10, pageSizeOptions: ['10', '50', '100', '500'] });
  const routeParams = router.currentRoute.value.query;
  const engine = ref(routeParams.engine ? routeParams.engine : 'hunter');
  const searchFormSchema: FormSchema[] = [
    {
      label: '搜索引擎',
      field: 'engine',
      component: 'RadioButtonGroup',
      defaultValue: routeParams.engine ? routeParams.engine : 'hunter',
      componentProps: {
        resizeTo: 'auto',
        options: [
          { label: 'Hunter', value: 'hunter' },
          { label: 'Fofa', value: 'fofa' },
          { label: 'Quake', value: 'quake' },
          { label: '0.zone', value: '0zone' },
          { label: 'Shodan', value: 'shodan' },
        ],
        onChange: (value) => {
          engine.value = value;
          handleEngineChange(value);
        },
      },
      colProps: {
        span: 8,
      },
    },
    {
      label: '查询语法',
      field: 'keyword',
      defaultValue: routeParams.keyword ? routeParams.keyword : '',
      component: 'JSearchEngineSearch',
      componentProps: {
        placeholder: '请输入查询语法',
        engine: engine.value,
        handleAutoComplete: async (keyword) => {
          try {
            return await searchAutoComplete({ engine: engine.value, keyword });
          } catch (error) {
            console.error('Error fetching options:', error);
            return [];
          }
        },
        handleMark: async (keyword) => {
          await collectKeyword({ keyword: keyword, engine: engine.value, type: 'user' });
        },
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'joinTime',
      label: '时间范围',
      component: 'RangePicker',
      show: ({ values }) => values.engine === 'hunter', // 只有选择 Hunter 才展示该输入框
      componentProps: {
        valueType: 'Date',
      },
    },
    {
      // 根据选择的搜索引擎动态展示的输入框
      label: '资产类型',
      field: 'isWeb',
      component: 'Select',
      defaultValue: '',
      show: ({ values }) => values.engine === 'hunter', // 只有选择 Hunter 才展示该输入框
      componentProps: {
        options: [
          { label: 'Web资产', value: '1' },
          { label: '非Web资产', value: '2' },
          { label: '全部', value: '3' },
        ],
        placeholder: '请选择资产类型',
      },
    },
    {
      // 根据选择的搜索引擎动态展示的输入框
      label: '状态码列表',
      field: 'statusCode',
      component: 'Input',
      helpMessage: '状态码列表，以逗号分隔，如”200,401“',
      show: ({ values }) => values.engine === 'hunter', // 只有选择 Hunter 才展示该输入框
      componentProps: {},
    },
    {
      // 根据选择的搜索引擎动态展示的输入框
      label: '数据去重',
      field: 'portFilter',
      helpMessage: '数据去重参数，需要付费使用',
      component: 'Switch',
      show: ({ values }) => values.engine === 'hunter', // 只有选择 Hunter 才展示该输入框
      componentProps: {
        checkedChildren: '开启',
        unCheckedChildren: '关闭',
      },
    },
    {
      // 是否全量数据
      label: '全量数据',
      field: 'full',
      component: 'Switch',
      helpMessage: '默认搜索一年内的数据，开启即可搜索全部数据',
      ifShow: ({ values }) => values.engine === 'fofa', // 只有选择 Hunter 才展示该输入框
      componentProps: {
        checkedChildren: '开启',
        unCheckedChildren: '关闭',
      },
    },
    {
      label: '起始时间',
      helpMessage: '仅付费用户能够指定查询时间',
      field: 'startTime',
      component: 'DatePicker',
      ifShow: ({ values }) => values.engine === 'quake', // 只有选择 quake 才展示该输入框
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '选择起始时间',
      },
    },
    {
      label: '截止时间',
      field: 'endTime',
      helpMessage: '仅付费用户能够指定查询时间',
      component: 'DatePicker',
      ifShow: ({ values }) => values.engine === 'quake', // 只有选择 quake 才展示该输入框
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '选择截止时间',
      },
    },
    {
      label: '过滤参数',
      field: 'shortcuts',
      component: 'Input',
      helpMessage: '对应web页面里的 过滤无效请求 排除蜜罐 排除CDN等',
      ifShow: ({ values }) => values.engine === 'quake', // 只有选择 quake 才展示该输入框
      componentProps: {
        placeholder: '请去quake web页面获取',
      },
    },
    {
      // 付费查询
      label: '更新时间排序',
      field: 'timestampSort',
      component: 'Switch',
      ifShow: ({ values }) => values.engine === '0zone', // 只有选择 0zone 才展示该输入框
      componentProps: {
        checkedChildren: '升序',
        unCheckedChildren: '降序',
        defaultValue: 'ASC',
      },
    },
    {
      // 付费查询
      label: '发现时间排序',
      field: 'exploreTimestampSort',
      component: 'Switch',
      ifShow: ({ values }) => values.engine === '0zone', // 只有选择 0zone 才展示该输入框
      componentProps: {
        checkedChildren: '升序',
        unCheckedChildren: '降序',
      },
    },
    {
      // 付费查询
      label: '付费查询',
      field: 'zbPay',
      component: 'Switch',
      helpMessage: '超出每日免费请求次数后，是否通过Z币自动扣费',
      ifShow: ({ values }) => values.engine === '0zone', // 只有选择 0zone 才展示该输入框
      componentProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
    },
  ];

  function handleEngineChange(value) {
    // 设置分页大小，根据需要调整每个搜索引擎的分页大小
    switch (value) {
      case 'shodan':
        setPagination({ pageSize: 100, pageSizeOptions: ['100'] });
        break;
      case '0zone':
        setPagination({ pageSize: 100, pageSizeOptions: ['10', '50', '100'] });
        break;
      case 'fofa':
        setPagination({ pageSize: 100, pageSizeOptions: ['50', '100', '500', '1000'] });
        break;
      case 'hunter':
        setPagination({ pageSize: 10, pageSizeOptions: ['10', '50', '100', '500'] });
        break;
      case 'quake':
        setPagination({ pageSize: 100, pageSizeOptions: ['10', '50', '100', '500'] });
        break;
    }
  }

  /**
   * 成功回调
   */
  function handleSuccess() {
    selectedRowKeys.value = [];
  }

  const columns: BasicColumn[] = [
    {
      title: 'ip',
      align: 'center',
      dataIndex: 'ip',
      width: 150,
      resizable: true,
    },
    {
      align: 'center',
      customRender: ({ record }) => {
        if (record.domains) {
          return record.domains;
        } else {
          return record.domain || '-';
        }
      },
      dataIndex: 'domain',
      resizable: true,
      title: '域名',
      width: 150,
    },
    {
      title: '端口/服务',
      align: 'center',
      dataIndex: 'port',
      width: 100,
      resizable: true,
      customRender: ({ record }) => {
        return h('span', [
          record.port,
          h(Tag, { color: record.protocol === 'http' ? 'green' : 'blue', style: 'margin-left: 6px;' }, () => record.protocol),
        ]);
      },
    },
    {
      title: '站点标题',
      align: 'center',
      dataIndex: 'title',
      resizable: true,
      width: 260,
      customRender: ({ record }) => {
        return h('span', [
          h(
            'a',
            {
              href: record.url,
              target: '_blank',
              rel: 'noreferrer',
              style: 'display: inline-flex; align-items: center;', // 使文本和图标垂直居中
            },
            [
              record.title ? record.title : record.url,
              h(Icon, { icon: 'ant-design:ie-outlined', style: 'margin-left: 6px;' }), // 使用Ant Design Vue的图标组件
            ]
          ),
        ]);
      },
    },
    {
      title: '状态码',
      align: 'center',
      width: '80',
      resizable: true,
      dataIndex: 'statusCode',
    },
    {
      title: 'ICP备案企业',
      align: 'center',
      resizable: true,
      dataIndex: 'company',
    },
    {
      title: 'ICP备案号',
      align: 'center',
      resizable: true,
      dataIndex: 'icpNumber',
    },
    {
      title: '应用/组件',
      align: 'center',
      dataIndex: 'component',
      resizable: true,
      customRender: ({ record }) => {
        if (record.component) {
          const components = JSON.parse(record.component);
          // 使用Fragment包裹所有的span标签
          return h(
            'div',
            { style: { 'argin-bottom': '10px' } },
            components.map((item, index) => {
              let color = 'default';
              // 根据不同的条件设置不同的颜色
              if (index % 2 === 0) {
                color = 'red';
              } else {
                color = 'blue';
              }
              const tagContent = `${item.name}${item.version ? ` (${item.version})` : ''}`;
              return h(Tag, { color: color, style: 'margin-left: 5px;' }, () => tagContent);
            })
          );
        } else {
          return h('span', '无数据');
        }
      },
    },
    {
      title: '国家',
      align: 'center',
      dataIndex: 'country',
      resizable: true,
    },
    {
      title: '地区',
      align: 'center',
      dataIndex: 'city',
      resizable: true,
    },
    {
      title: '传输协议',
      align: 'center',
      dataIndex: 'baseProtocol',
      resizable: true,
    },
    {
      title: 'Banner',
      align: 'center',
      dataIndex: 'banner',
      resizable: true,
    },
  ];
  //注册table数据
  const { prefixCls, tableContext } = useListPage({
    tableProps: {
      title: '搜索结果',
      api: search,
      columns,
      canResize: false,
      showIndexColumn: true,
      showActionColumn: false,
      rowKey: (record) => {
        return record.ip + record.port + record.domain + record.schema;
      },
      pagination: pagination,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: false,
        fieldMapToNumber: [],
        //将表单内时间区域的值映射成 2个字段, 'YYYY-MM-DD'日期格式化
        fieldMapToTime: [['joinTime', ['startTime', 'endTime'], 'YYYY-MM-DD']],
      },
      beforeFetch: (params) => {
        queryParam.params = params;
        queryParam.engine = params.engine;
        // handleEngineChange(params.engine);
      },
    },
  });
  const [registerTable, { reload, setPagination }, { rowSelection, selectedRowKeys }] = tableContext;
  /**
   * 批量导入
   */
  function handelBatchImport() {
    openModal(true, {
      data: rowSelection.selectedRows,
      engine: queryParam.engine,
    });
  }

  /**
   * 一键导入
   */
  function handleOneKeyImport() {
    openModal(true, {
      // data: rowSelection.selectedRows,
      params: queryParam.params,
    });
  }
</script>

<style scoped lang="less"></style>
