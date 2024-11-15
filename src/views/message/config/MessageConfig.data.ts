import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '消息类型',
    align: 'center',
    dataIndex: 'webHookType_dictText',
  },
  {
    title: 'WebHook地址',
    align: 'center',
    dataIndex: 'webHookUrl',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '消息类型',
    field: 'webHookType',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'webHookType',
    },
    //colProps: {span: 6},
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: 'webHook类型',
    field: 'webHookType',
    component: 'JDictSelectTag',
    required: true,
    componentProps: { dictCode: 'webHookType', type: 'radio' },
  },
  {
    label: 'WebHook地址',
    field: 'webHookUrl',
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
  webHookType: { title: '消息类型', order: 0, view: 'list', type: 'string', dictCode: 'webHookType' },
  webHookUrl: { title: 'WebHook地址', order: 1, view: 'text', type: 'string' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
