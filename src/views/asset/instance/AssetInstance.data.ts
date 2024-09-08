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
    title: '资产ID',
    align: 'center',
    dataIndex: 'assetId',
  },
  {
    title: '实例ID',
    align: 'center',
    dataIndex: 'instanceId',
  },
  {
    title: '关联类型',
    align: 'center',
    dataIndex: 'type',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '资产类型',
    field: 'assetType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'asset_type',
    },
  },
  {
    label: '资产ID',
    field: 'assetId',
    component: 'Input',
  },
  {
    label: '实例ID',
    field: 'instanceId',
    component: 'Input',
  },
  {
    label: '关联类型',
    field: 'type',
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
  assetType: { title: '资产类型', order: 0, view: 'list', type: 'string', dictCode: 'asset_type' },
  assetId: { title: '资产ID', order: 1, view: 'text', type: 'string' },
  instanceId: { title: '实例ID', order: 2, view: 'text', type: 'string' },
  type: { title: '关联类型', order: 3, view: 'text', type: 'string' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
