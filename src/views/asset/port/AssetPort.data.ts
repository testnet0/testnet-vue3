import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
import { router } from '@/router';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '项目',
    align: 'center',
    dataIndex: 'projectId_dictText',
    fixed: 'left',
    resizable: true,
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            router.push({
              path: '/testnet/projectList',
              query: {
                id: record.projectId ? record.projectId : '',
                t: new Date().getTime(),
              },
            });
          },
        },
        record.projectId_dictText ? record.projectId_dictText : ''
      );
    },
  },
  {
    title: 'ip',
    align: 'center',
    fixed: 'left',
    resizable: true,
    dataIndex: 'ip_dictText',
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            router.push({
              path: '/testnet/assetIpList',
              query: {
                id: record.ip, // 假设record.id是当前记录的有效标识符
                t: new Date().getTime(), // 一个时间戳，可能用于防缓存
              },
            });
          },
        },
        record.ip_dictText
      ); // 如果ipList不存在或者为空数组，则显示"暂无"
    },
  },
  {
    title: '端口',
    align: 'center',
    resizable: true,
    fixed: 'left',
    width: 80,
    dataIndex: 'port',
  },
  {
    title: '子域名',
    align: 'center',
    resizable: true,
    dataIndex: 'assetSubDomainList',
    customRender: ({ record }) => {
      if (!record.domains || record.domains.length === 0) {
        return '暂无';
      }
      return h(
        'div',
        {
          style: { display: 'flex', flexDirection: 'column' }, // 使用flex布局，子元素自动换行
        },
        record.domains.map((domainObj, index) => {
          return h(
            'a',
            {
              key: index, // 添加key以帮助React识别元素
              onClick: (event) => {
                event.preventDefault();
                router.push({
                  path: '/testnet/assetSubdomainList',
                  query: {
                    id: domainObj.id,
                    t: new Date().getTime(), // 时间戳，用于防缓存
                  },
                });
              },
            },
            domainObj.subDomain
          );
        })
      );
    },
  },
  {
    title: '协议',
    align: 'center',
    dataIndex: 'protocol',
  },
  {
    title: 'Web资产',
    align: 'center',
    dataIndex: 'isWeb',
    filters: [
      { text: '是', value: 'Y' },
      { text: '否', value: 'N' },
    ],
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y' },
        { text: '否', value: 'N' },
      ]);
    },
  },
  {
    title: '是否TLS',
    align: 'center',
    dataIndex: 'isTls',
    filters: [
      { text: '是', value: 'Y' },
      { text: '否', value: 'N' },
    ],
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y' },
        { text: '否', value: 'N' },
      ]);
    },
  },
  {
    title: '服务',
    align: 'center',
    dataIndex: 'service',
  },
  {
    title: '产品',
    align: 'center',
    dataIndex: 'product',
  },
  {
    title: '版本',
    align: 'center',
    dataIndex: 'version',
  },
  {
    title: '资产标签',
    align: 'center',
    dataIndex: 'assetLabel_dictText',
  },
  {
    title: '来源',
    align: 'center',
    dataIndex: 'source',
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
    sorter: true,
  },
  {
    title: '更新时间',
    align: 'center',
    dataIndex: 'updateTime',
    sorter: true,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '项目',
    field: 'projectId',
    component: 'JSearchSelect',
    componentProps: {
      dict: 'project,project_name,id',
      async: true,
    },
    //colProps: {span: 6},
  },
  {
    label: 'IP',
    field: 'ip',
    component: 'JPopupDict',
    componentProps: {
      placeholder: '请选择',
      dictCode: 'select_ip,ip,ai_id',
    },
  },
  {
    label: '子域名',
    field: 'sub_domain',
    component: 'JPopup',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue } = formActionType;
      return {
        setFieldsValue,
        placeholder: '请选择',
        code: 'select_sub_domain',
        fieldConfig: [
          { source: 'id', target: 'sub_domain_id' },
          { source: 'sub_domain', target: 'sub_domain' },
          { source: 'project_id', target: 'projectId' },
        ],
      };
    },
  },
  {
    label: '子域名',
    field: 'sub_domain_id',
    component: 'Input',
    show: false,
    //colProps: {span: 6},
  },
  {
    label: '端口号',
    field: 'port',
    component: 'Input',
    //colProps: {span: 6},
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '所属项目',
    field: 'projectId',
    component: 'JSearchSelect',
    componentProps: {
      dict: 'project,project_name,id',
      async: true,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入所属项目!' }];
    },
  },
  {
    label: 'IP',
    field: 'ip',
    component: 'JPopupDict',
    componentProps: {
      placeholder: '请选择',
      dictCode: 'select_ip,ip,ai_id',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入所属项目!' }];
    },
  },
  {
    label: '端口号',
    field: 'port',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '请输入端口号!' },
        {
          pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
          message: '请输入正确的端口号',
        },
      ];
    },
  },
  {
    label: '服务',
    field: 'service',
    component: 'Input',
  },
  {
    label: '产品',
    field: 'product',
    component: 'Input',
  },
  {
    label: '版本',
    field: 'version',
    component: 'Input',
  },
  {
    label: 'Web资产',
    field: 'isWeb',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {},
  },
  {
    label: '资产标签',
    field: 'assetLabel',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'asset_label,label_name,id',
      // getPopupContainer: (node) => node.parentNode,
    },
  },
  {
    label: '来源',
    field: 'source',
    component: 'Input',
    show: false,
    defaultValue: '手工录入',
  },
  {
    label: '协议',
    field: 'protocol',
    component: 'Input',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

// 高级查询数据
export const superQuerySchema = {
  port: { title: '端口号', order: 0, view: 'number', type: 'number' },
  ip: { title: '所属ip', order: 1, view: 'sel_search', type: 'string', dictTable: 'asset_ip', dictCode: 'id', dictText: 'ip' },
  product: { title: '产品', order: 2, view: 'text', type: 'string' },
  service: { title: '服务', order: 3, view: 'text', type: 'string' },
  version: { title: '版本', order: 4, view: 'text', type: 'string' },
  isWeb: { title: 'Web资产', order: 5, view: 'switch', type: 'string' },
  source: { title: '来源', order: 6, view: 'list', type: 'string' },
  protocol: { title: '协议', order: 7, view: 'text', type: 'string' },
  createTime: { title: '创建时间', order: 8, view: 'date', type: 'string' },
  updateTime: { title: '更新时间', order: 9, view: 'date', type: 'string' },
  assetLabel: {
    title: '资产标签',
    order: 10,
    view: 'sel_search',
    type: 'string',
    dictTable: 'asset_label',
    dictCode: 'id',
    dictText: 'label_name',
  },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
