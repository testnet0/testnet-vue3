import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '资产类型',
    align: 'center',
    dataIndex: 'assetType_dictText',
  },
  {
    title: '黑名单类型',
    align: 'center',
    dataIndex: 'blacklistType_dictText',
  },
  {
    title: '关键字/正则表达式',
    align: 'center',
    dataIndex: 'keyword',
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '资产类型',
    field: 'assetType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'asset_type',
      mode: 'multiple',
    },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '资产类型',
    field: 'assetType',
    component: 'JDictSelectTag',
    required: true,
    componentProps: {
      dictCode: 'asset_type',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '黑名单类型',
    field: 'blacklistType',
    required: true,
    defaultValue: 'keyword',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'blacklist_type',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '关键字/正则表达式',
    field: 'keyword',
    component: 'Input',
  },
  {
    label: '备注',
    field: 'remark',
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
  keyword: { title: '关键字', order: 0, view: 'text', type: 'string' },
  remark: { title: '备注', order: 1, view: 'text', type: 'string' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
