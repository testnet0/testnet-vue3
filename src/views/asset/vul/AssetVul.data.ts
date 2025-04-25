import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
import { router } from '@/router';
import { CURRENT_PROJECT_ID_KEY } from '../project/Project.api';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '漏洞名称',
    align: 'center',
    dataIndex: 'vulName',
    width: '250px',
    ellipsis: true,
    resizable: true,
  },
  {
    title: '等级',
    align: 'center',
    width: 100,
    resizable: true,
    dataIndex: 'severity',
    filters: [
      {
        text: '信息',
        value: 'info',
      },
      {
        text: '低危',
        value: 'low',
      },
      {
        text: '中危',
        value: 'medium',
      },
      {
        text: '高危',
        value: 'high',
      },
      {
        text: '紧急',
        value: 'critical',
      },
      {
        text: '未知',
        value: 'unknown',
      },
    ],
    sorter: true,
    customRender: ({ record }) => {
      const colorMap: { [key: string]: string } = {
        info: 'default',
        low: 'success',
        medium: 'processing',
        high: 'warning',
        critical: 'error',
      };
      const color = colorMap[record.severity.toLowerCase()] || 'default';
      return render.renderTag(record.severity_dictText, color);
    },
  },
  {
    title: '类型',
    align: 'center',
    dataIndex: 'vulType',
    resizable: true,
  },
  {
    title: '状态',
    align: 'center',
    width: 100,
    filters: [
      {
        text: '待确认',
        value: '0',
      },
      {
        text: '已确认',
        value: '1',
      },
      {
        text: '已修复',
        value: '2',
      },
      {
        text: '已忽略',
        value: '3',
      },
      {
        text: '已加白',
        value: '4',
      },
    ],
    dataIndex: 'vulStatus',
    customRender: ({ record }) => {
      const colorMap: { [key: string]: string } = {
        0: 'success',
        1: 'warning',
        2: 'processing',
        3: 'processing',
      };
      const color = colorMap[record.vulStatus] || 'default';
      return render.renderTag(record.vulStatus_dictText, color);
    },
  },
  {
    title: '资产类型',
    align: 'center',
    dataIndex: 'assetType_dictText',
    width: 100,
  },
  {
    title: '关联资产',
    align: 'center',
    dataIndex: 'assetType_dictText',
    resizable: true,
    customRender: ({ record }) => {
      switch (record.assetType) {
        case 'ip':
          return h(
            'a',
            {
              onClick: () => {
                router.push({
                  path: '/testnet/assetIpList',
                  query: {
                    id: record.ipId,
                    t: new Date().getTime(),
                  },
                });
              },
            },
            record.ipId_dictText
          );
        case 'sub_domain':
          return h(
            'a',
            {
              onClick: () => {
                router.push({
                  path: '/testnet/assetSubDomainList',
                  query: {
                    id: record.subDomainId,
                    t: new Date().getTime(),
                  },
                });
              },
            },
            record.subDomainId_dictText
          );
        case 'web':
          return h(
            'a',
            {
              onClick: () => {
                router.push({
                  path: '/testnet/assetWebList',
                  query: {
                    id: record.webId,
                    t: new Date().getTime(),
                  },
                });
              },
            },
            record.webId_dictText
          );
        case 'port':
          return h(
            'a',
            {
              onClick: () => {
                router.push({
                  path: '/testnet/assetPortList',
                  query: {
                    id: record.portId,
                    t: new Date().getTime(),
                  },
                });
              },
            },
            record.ipId_dictText + ':' + record.portId_dictText
          );
      }
    },
  },
  {
    title: '访问链接',
    align: 'center',
    dataIndex: 'vulUrl',
    customRender({ record }) {
      return h('a', { target: '_blank', href: record.vulUrl }, record.vulUrl);
    },
    resizable: true,
  },
  {
    title: '来源',
    align: 'center',
    dataIndex: 'source',
    resizable: true,
  },
  {
    title: '漏洞负责人',
    align: 'center',
    resizable: true,
    dataIndex: 'assetManager_dictText',
  },
  {
    title: '漏洞负责部门',
    align: 'center',
    resizable: true,
    dataIndex: 'assetDepartment_dictText',
  },
  {
    title: '创建日期',
    align: 'center',
    dataIndex: 'createTime',
    sorter: true,
    resizable: true,
  },
  {
    title: '更新日期',
    align: 'center',
    dataIndex: 'updateTime',
    sorter: true,
    resizable: true,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '所属项目',
    field: 'projectId',
    component: 'JSearchSelect',
    componentProps: {
      dict: 'project,project_name,id',
      async: true,
    },
    defaultValue: localStorage.getItem(CURRENT_PROJECT_ID_KEY),
  },
  {
    label: '资产类型',
    field: 'assetType',
    component: 'JSelectInput',
    componentProps: {
      options: [
        { value: 'web', label: 'Web' },
        { value: 'sub_domain', label: '子域名' },
        { value: 'ip', label: 'IP' },
      ],
    },
  },
  {
    label: '漏洞名称',
    field: 'vulName',
    component: 'Input',
  },
  {
    label: '漏洞等级',
    field: 'severity',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'severity',
      mode: 'multiple',
    },
  },
  {
    label: '漏洞状态',
    field: 'vulStatus',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'vul_status',
      mode: 'multiple',
    },
  },
  {
    label: '漏洞类型',
    field: 'vulType',
    component: 'Input',
    componentProps: {
      dictCode: '',
    },
  },
  {
    label: '漏洞负责人',
    field: 'owner',
    component: 'JSelectUser',
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '资产类型',
    field: 'assetType',
    component: 'JSelectInput',
    componentProps: {
      options: [
        { value: 'web', label: 'Web' },
        { value: 'sub_domain', label: '子域名' },
        { value: 'ip', label: 'IP' },
        { value: 'port', label: '端口' },
      ],
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择资产类型!' }];
    },
  },
  {
    label: '选择Web',
    field: 'assetId',
    component: 'JSearchSelect',
    componentProps: {
      dict: 'asset_web,web_url,id',
      async: true,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择关联资产!' }];
    },
    ifShow(renderCallbackParams) {
      return renderCallbackParams.values.assetType === 'web';
    },
  },
  {
    label: '选择IP',
    field: 'assetId',
    component: 'JSearchSelect',
    componentProps: {
      dict: 'asset_ip,ip,id',
      async: true,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择关联资产!' }];
    },
    ifShow(renderCallbackParams) {
      return renderCallbackParams.values.assetType === 'ip';
    },
  },
  {
    label: '选择子域名',
    field: 'assetId',
    component: 'JSearchSelect',
    componentProps: {
      dict: 'asset_sub_domain,sub_domain,id',
      async: true,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择关联资产!' }];
    },
    ifShow(renderCallbackParams) {
      return renderCallbackParams.values.assetType === 'sub_domain';
    },
  },
  {
    label: '选择端口',
    field: 'assetId',
    component: 'JPopupDict',
    componentProps: {
      placeholder: '请选择',
      dictCode: 'select_port,ip_port,id',
      multi: false,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择关联资产!' }];
    },
    ifShow(renderCallbackParams) {
      return renderCallbackParams.values.assetType === 'port';
    },
  },
  {
    label: '漏洞名称',
    field: 'vulName',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入漏洞名称!' }];
    },
  },
  {
    label: '漏洞等级',
    field: 'severity',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'severity',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择漏洞等级!' }];
    },
  },
  {
    label: '漏洞状态',
    field: 'vulStatus',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'vul_status',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择漏洞状态!' }];
    },
  },
  {
    label: '请求包',
    field: 'requestBody',
    component: 'JCodeEditor',
    componentProps: {
      language: 'javascript',
    },
  },
  {
    label: '响应包',
    field: 'responseBody',
    component: 'JCodeEditor',
  },
  {
    label: '来源',
    field: 'source',
    component: 'Input',
  },
  {
    label: '漏洞描述',
    field: 'vulDesc',
    component: 'Input',
  },
  {
    label: '漏洞链接',
    field: 'vulUrl',
    component: 'Input',
  },
  {
    label: 'Payload',
    field: 'payload',
    component: 'JCodeEditor',
  },
  {
    label: '负责人',
    field: 'assetManager',
    component: 'JSelectUser',
  },
  {
    label: '负责部门',
    field: 'assetDepartment',
    component: 'JSelectDept',
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
  projectId: { title: '所属项目', order: 0, view: 'sel_search', type: 'string', dictTable: 'project', dictCode: 'id', dictText: 'project_name' },
  assetType: { title: '资产类型', order: 0, view: 'list', type: 'string', dictCode: 'asset_type' },
  assetId: { title: '资产ID', order: 1, view: 'text', type: 'string' },
  vulName: { title: '漏洞名称', order: 2, view: 'text', type: 'string' },
  requestBody: { title: '请求包', order: 3, view: 'text', type: 'string' },
  responseBody: { title: '响应包', order: 4, view: 'text', type: 'string' },
  vulType: { title: '漏洞类型', order: 5, view: 'list', type: 'string' },
  source: { title: '来源', order: 6, view: 'text', type: 'string' },
  vulStatus: { title: '漏洞状态', order: 7, view: 'list', type: 'string', dictCode: 'vul_status' },
  severity: { title: '漏洞级别', order: 8, view: 'list', type: 'string', dictCode: 'severity' },
  vulDesc: { title: '漏洞描述', order: 9, view: 'text', type: 'string' },
  vulUrl: { title: '漏洞链接', order: 10, view: 'text', type: 'string' },
  payload: { title: '触发请求包', order: 11, view: 'text', type: 'string' },
  createTime: { title: '创建时间', order: 12, view: 'datetime', type: 'string' },
  updateTime: { title: '更新时间', order: 13, view: 'datetime', type: 'string' },
  assetManager: {
    title: '漏洞负责人',
    order: 10,
    view: 'sel_user',
    type: 'string',
  },
  assetDepartment: {
    title: '漏洞负责部门',
    order: 11,
    view: 'sel_depart',
    type: 'string',
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
