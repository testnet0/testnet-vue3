import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { h } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '标题',
    align: 'center',
    dataIndex: 'title',
    resizable: true,
  },
  {
    title: '请求方法',
    align: 'center',
    dataIndex: 'httpMethod_dictText',
  },
  {
    title: 'URL',
    customRender(opt) {
      return h('a', { href: opt.record.assetWebTreeId_dictText, target: '_blank', rel: 'noreferrer' }, opt.record.assetWebTreeId_dictText);
    },
  },
  {
    title: '状态码',
    align: 'center',
    dataIndex: 'statusCode',
  },
  {
    title: '返回包大小',
    align: 'center',
    dataIndex: 'contentLength',
  },
  {
    title: '来源',
    align: 'center',
    dataIndex: 'source',
  },
  {
    title: '路径hash',
    align: 'center',
    dataIndex: 'hash',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '标题',
    field: 'title',
    component: 'Input',
  },
  {
    label: '请求方法',
    field: 'httpMethod',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'http_method',
      mode: 'multiple',
    },
  },
  {
    label: '状态码',
    field: 'statusCode',
    component: 'InputNumber',
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
    label: '链接',
    field: 'absolutePath',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '请输入路径!' },
        {
          pattern: /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/,
          message: '请输入正确的路径!',
        },
      ];
    },
    ifShow: ({ values }) => {
      return values.id == null;
    },
  },

  {
    label: '请求方法',
    field: 'httpMethod',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'http_method',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入请求方法!' }];
    },
    dynamicDisabled({ values }) {
      return values.id != null;
    },
  },
  {
    label: 'assetWebTreeId',
    field: 'assetWebTreeId',
    component: 'JInput',
    show: false,
  },
  {
    label: '路径',
    field: 'assetWebTreeId_dictText',
    component: 'Input',
    dynamicDisabled(renderCallbackParams) {
      return true;
    },
    ifShow: ({ values }) => {
      return values.id != null;
    },
  },
  {
    label: '标题',
    field: 'title',
    component: 'Input',
  },
  {
    label: '状态码',
    field: 'statusCode',
    component: 'InputNumber',
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
    label: '请求头',
    field: 'requestHeader',
    component: 'JCodeEditor',
    componentProps: {
      language: 'javascript',
    },
  },
  {
    label: '请求体',
    field: 'requestBody',
    component: 'JCodeEditor',
    componentProps: {
      language: 'javascript',
    },
  },
  {
    label: '响应头',
    field: 'responseHeader',
    component: 'JCodeEditor',
    componentProps: {
      language: 'javascript',
    },
  },
  {
    label: '响应体',
    field: 'responseBody',
    component: 'JCodeEditor',
    componentProps: {
      language: 'javascript',
    },
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '',
    field: 'source',
    defaultValue: '手工录入',
    component: 'Input',
    show: false,
  },
];

// 高级查询数据
export const superQuerySchema = {
  projectId: {
    title: '所属项目',
    order: 1,
    view: 'list',
    type: 'string',
    dictTable: 'project',
    dictCode: 'id',
    dictText: 'project_name',
  },
  statusCode: { title: '状态码', order: 2, view: 'number', type: 'number' },
  title: { title: '标题', order: 3, view: 'text', type: 'string' },
  httpMethod: { title: '请求方法', order: 4, view: 'list', type: 'string', dictCode: 'http_method' },
  requestHeader: { title: '请求头', order: 5, view: 'text', type: 'string' },
  requestBody: { title: '请求体', order: 6, view: 'text', type: 'string' },
  responseHeader: { title: '响应头', order: 7, view: 'text', type: 'string' },
  responseBody: { title: '响应体', order: 8, view: 'text', type: 'string' },
  source: { title: '来源', order: 9, view: 'text', type: 'string' },
  hash: { title: 'hash值', order: 10, view: 'text', type: 'string' },
  contentLength: { title: '返回包大小', order: 11, view: 'number', type: 'number' },
  contentType: { title: '返回类型', order: 12, view: 'text', type: 'string' },
  assetLabel: { title: '资产标签', order: 13, view: 'list_multi', type: 'string', dictTable: 'asset_label', dictCode: 'id', dictText: 'label_name' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
