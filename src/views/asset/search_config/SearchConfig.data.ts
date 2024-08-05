import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '引擎名称',
    align: 'center',
    dataIndex: 'engineName_dictText',
  },
  {
    title: '引擎Token',
    align: 'center',
    dataIndex: 'engineToken',
    customRender: ({ record }) => {
      return record.engineToken.substring(0, 5) + '***';
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '引擎名称',
    field: 'engineName',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'engine_name',
    },
  },
  {
    label: '引擎Token',
    field: 'engineToken',
    component: 'InputPassword',
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
  engineName: { title: '引擎名称', order: 0, view: 'list', type: 'string', dictCode: 'engine_name' },
  engineToken: { title: '引擎Token', order: 1, view: 'password', type: 'string' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
