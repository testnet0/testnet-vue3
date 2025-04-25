import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import {h, ref} from 'vue';
import { router } from '@/router';
import { createContextMenu } from '@/components/ContextMenu';
import { Tag } from 'ant-design-vue';
import { CURRENT_PROJECT_ID_KEY } from '../project/Project.api';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '项目',
    align: 'center',
    dataIndex: 'projectId_dictText',
    fixed: 'left',
    resizable: true,
  },
  {
    title: '公司名称',
    align: 'center',
    resizable: true,
    dataIndex: 'companyName',
    customRender: ({ record }) => {
      return h('a-button', { onContextmenu: (e: MouseEvent) => handleContext(e, record) }, record.companyName ? record.companyName : '');
    },
  },
  {
    title: '资产标签',
    align: 'center',
    dataIndex: 'assetLabel_dictText',
    resizable: true,
    customRender: ({ record }) => {
      if (record.assetLabel_dictText) {
        return h(
          'div',
          {
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px', // 标签之间间距
              justifyContent: 'center', // 标签居中
            },
          },
          record.assetLabel_dictText.split(',').map((item, index) => {
            const colors = [
              '#ffb74d', // 中等橙色
              '#81c784', // 中等绿色
              '#7986cb', // 中等蓝色
              '#f06292', // 中等粉色
              '#ff8a65', // 中等红色
              '#aed581', // 亮绿色
              '#64b5f6', // 亮蓝色
              '#fff176', // 亮黄色
              '#ba68c8', // 中等紫色
              '#ffb300', // 中等金色
              '#dce775', // 柔和黄绿色
            ];
            // 根据索引轮流使用颜色数组中的颜色
            const backgroundColor = colors[index % colors.length];

            return h(
              Tag,
              {
                color: backgroundColor,
                style: {
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)', // 更轻微的阴影
                  transition: 'all 0.3s ease', // 平滑过渡
                  cursor: 'pointer',
                },
                onClick: () => {
                  router.push({
                    path: '/testnet/assetCompanyList',
                    query: {
                      assetLabel: record.assetLabel.split(',')[index],
                      t: new Date().getTime(),
                    },
                  });
                },
              },
              () => item
            );
          })
        );
      }
    },
  },
  {
    title: '来源',
    align: 'center',
    dataIndex: 'source',
    resizable: true,
  },
  {
    title: '负责人',
    align: 'center',
    resizable: true,
    dataIndex: 'assetManager_dictText',
  },
  {
    title: '负责部门',
    align: 'center',
    resizable: true,
    dataIndex: 'assetDepartment_dictText',
  },
  {
    title: '创建时间',
    align: 'center',
    resizable: true,
    dataIndex: 'createTime',
    sorter: true,
  },
  {
    title: '更新时间',
    resizable: true,
    align: 'center',
    dataIndex: 'updateTime',
    sorter: true,
  },
];

// 定义响应式变量
const currentProjectId = ref(localStorage.getItem(CURRENT_PROJECT_ID_KEY) || '');

// 监听 localStorage 变化
window.addEventListener('storage', (event) => {
  if (event.key === CURRENT_PROJECT_ID_KEY) {
    currentProjectId.value = event.newValue;
  }
});

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
    defaultValue: currentProjectId.value,
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
    defaultValue: localStorage.getItem(CURRENT_PROJECT_ID_KEY),
  },
  {
    label: '公司名称',
    field: 'companyName',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入公司名称!' }];
    },
    componentProps: {
      autoSize: {
        //最小显示行数
        minRows: 3,
      },
      placeholder: '可以同时输入多个，换行分割，如:\n公司1\n公司2',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '资产标签',
    field: 'assetLabel',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'asset_label,label_name,id',
      getPopupContainer: (node) => document.body,
    },
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
  createTime: { title: '创建时间', order: 7, view: 'datetime', type: 'string' },
  updateTime: { title: '更新时间', order: 8, view: 'datetime', type: 'string' },
  assetLabel: {
    title: '资产标签',
    order: 9,
    view: 'sel_search',
    type: 'string',
    dictTable: 'asset_label',
    dictCode: 'id',
    dictText: 'label_name',
  },
  assetManager: {
    title: '负责人',
    order: 10,
    view: 'sel_user',
    type: 'string',
  },
  assetDepartment: {
    title: '负责部门',
    order: 11,
    view: 'sel_depart',
    type: 'string',
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
