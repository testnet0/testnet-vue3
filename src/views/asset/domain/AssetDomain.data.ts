import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
import { router } from '@/router';
import {createContextMenu} from "@/components/ContextMenu";

const handleContext = (e: MouseEvent, record: any) => {
  e.preventDefault();
  createContextMenu({
    event: e,
    items: [
      {
        label: 'Hunter搜索',
        icon: 'icon-park:search',
        handler: () => {
          router.push({
            path: '/testnet/search',
            query: {
              engine: 'hunter',
              keyword: `domain.suffix="${record.domain}"`,
            },
          });
        },
      },
      {
        label: 'Fofa搜索',
        icon: 'icon-park:font-search',
        handler: () => {
          router.push({
            path: '/testnet/search',
            query: {
              engine: 'fofa',
              keyword: `domain="${record.domain}"`,
            },
          });
        },
      },
      {
        label: 'Quake搜索',
        icon: 'icon-park:doc-search',
        handler: () => {
          router.push({
            path: '/testnet/search',
            query: {
              engine: 'quake',
              keyword: `domain:"*.${record.domain}"`,
            },
          });
        },
      },
      {
        label: 'Shodan搜索',
        icon: 'icon-park:folder-search',
        handler: () => {
          router.push({
            path: '/testnet/search',
            query: {
              engine: 'shodan',
              keyword: `hostname:"${record.domain}"`,
            },
          });
        },
      },
    ],
  });
};
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
    title: '主域名',
    align: 'center',
    fixed: 'left',
    ellipsis: true,
    resizable: true,
    dataIndex: 'domain',
    customRender: ({ record }) => {
      return h('a-button', { onContextmenu: (e: MouseEvent) => handleContext(e, record) }, record.domain ? record.domain : '');
    },
  },
  {
    title: '子域名数量',
    align: 'center',
    ellipsis: true,
    resizable: true,
    dataIndex: 'subDomainNumber',
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            router.push({
              path: '/testnet/assetSubDomainList',
              query: { domainId: record.id, t: new Date().getTime() },
            });
          },
        },
        record.subDomainNumber
      );
    },
  },
  {
    title: 'ICP备案号',
    align: 'center',
    ellipsis: true,
    resizable: true,
    dataIndex: 'icpNumber',
  },
  {
    title: 'whois',
    align: 'center',
    dataIndex: 'whois',
  },
  {
    title: 'dns服务器',
    align: 'center',
    dataIndex: 'dnsServer',
  },
  {
    title: '所属公司/组织',
    align: 'center',
    dataIndex: 'companyId_dictText',
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
    // colProps: { span: 6 },
  },
  {
    label: '主域名',
    field: 'domain',
    component: 'Input',
    // colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '项目',
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
    label: '主域名',
    field: 'domain',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '请输入主域名!' },
      ];
    },
  },
  {
    label: '公司',
    field: 'companyId',
    component: 'JPopupDict',
    componentProps: {
      placeholder: '请选择',
      dictCode: 'select_company,company_name,company_id',
    },
  },
  {
    label: 'ICP备案号',
    field: 'icpNumber',
    component: 'Input',
  },
  {
    label: 'dns服务器',
    field: 'dnsServer',
    component: 'Input',
  },
  {
    label: 'whois',
    field: 'whois',
    component: 'Input',
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
    defaultValue: '手工录入',
    component: 'Input',
    show: false,
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
  projectId: { title: '项目', order: 0, view: 'sel_search', type: 'string', dictTable: 'project', dictCode: 'id', dictText: 'project_name' },
  companyId: {
    title: '所属公司',
    order: 1,
    view: 'list',
    type: 'string',
    dictTable: 'asset_company',
    dictCode: 'id',
    dictText: 'company_name',
  },
  domain: { title: '主域名', order: 2, view: 'text', type: 'string' },
  icpNumber: { title: 'ICP备案号', order: 3, view: 'text', type: 'string' },
  whois: { title: 'whois', order: 4, view: 'text', type: 'string' },
  source: { title: '来源', order: 5, view: 'text', type: 'string' },
  dnsServer: { title: 'DNS服务器', order: 6, view: 'text', type: 'string' },
  createTime: { title: '创建时间', order: 7, view: 'date', type: 'string' },
  updateTime: { title: '更新时间', order: 8, view: 'date', type: 'string' },
  assetLabel: {
    title: '资产标签',
    order: 9,
    view: 'list',
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
