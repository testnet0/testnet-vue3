import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '空间引擎名称',
    align: 'center',
    dataIndex: 'engine_dictText',
  },
  {
    title: '语法',
    align: 'center',
    dataIndex: 'keyword',
  },
  {
    title: '类型',
    align: 'center',
    dataIndex: 'type_dictText',
  },
  {
    title: '例句',
    align: 'center',
    dataIndex: 'example',
  },
  {
    title: '说明',
    align: 'center',
    dataIndex: 'remark',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    field: 'type',
    label: '类型',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'search_keyword_type',
      mode: 'multiple',
    },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '空间引擎名称',
    field: 'engine',
    component: 'JSelectMultiple',
    defaultValue: 'hunter',
    required: true,
    componentProps: {
      dictCode: 'engine_name',
    },
  },
  {
    label: '语法',
    field: 'keyword',
    component: 'Input',
  },
  {
    label: '类型',
    field: 'type',
    required: true,
    defaultValue: 'sys',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'search_keyword_type',
    },
  },
  {
    label: '例句',
    field: 'example',
    component: 'Input',
  },
  {
    label: '说明',
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
  engine: { title: '引擎', order: 0, view: 'text', type: 'string' },
  keyword: { title: '语法', order: 1, view: 'text', type: 'string' },
  type: { title: '类型', order: 2, view: 'text', type: 'string' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
