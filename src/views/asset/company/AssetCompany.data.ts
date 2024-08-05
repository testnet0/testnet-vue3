import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
import { router } from '@/router';
import {createContextMenu} from "@/components/ContextMenu";
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
    title: '公司名称',
    align: 'center',
    dataIndex: 'companyName',
    customRender: ({ record }) => {
      return h('a-button', { onContextmenu: (e: MouseEvent) => handleContext(e, record) }, record.companyName ? record.companyName : '');
    },
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
    label: '所属项目',
    field: 'projectId',
    component: 'JSearchSelect',
    componentProps: {
      dict: 'project,project_name,id',
      async: true,
    },
    // colProps: { span: 6 },
  },
  {
    label: '公司名称',
    field: 'companyName',
    component: 'Input',
    // colProps: { span: 6 },
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
    label: '公司名称',
    field: 'companyName',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入公司名称!' }];
    },
    componentProps: {
      getPopupContainer: (node) => document.body,
    },
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
  companyName: { title: '公司名称', order: 0, view: 'text', type: 'string' },
  projectId: {
    title: '所属项目',
    order: 1,
    view: 'list',
    type: 'string',
    dictTable: 'project',
    dictCode: 'id',
    dictText: 'project_name',
  },
  source: { title: '来源', order: 2, view: 'text', type: 'string' },
  createTime: { title: '创建时间', order: 7, view: 'date', type: 'string' },
  updateTime: { title: '更新时间', order: 8, view: 'date', type: 'string' },
  assetLabel: {
    title: '资产标签',
    order: 9,
    view: 'sel_search',
    type: 'string',
    dictTable: 'asset_label',
    dictCode: 'id',
    dictText: 'label_name',
  },
};

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
              keyword: 'icp.name=' + record.companyName,
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
              keyword: 'icp_keywords:' + record.companyName,
            },
          });
        },
      },
    ],
  });
};
/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
