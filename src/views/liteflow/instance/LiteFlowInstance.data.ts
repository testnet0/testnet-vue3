import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '实例ID',
    align: 'center',
    dataIndex: 'id',
    resizable: true,
    ellipsis: true,
  },
  {
    title: '运行流程',
    align: 'center',
    dataIndex: 'chainId_dictText',
  },
  {
    title: '执行节点',
    align: 'center',
    dataIndex: 'clientId_dictText',
  },
  {
    title: '实例状态',
    align: 'center',
    dataIndex: 'instanceStatus_dictText',
  },
  {
    title: '创建日期',
    align: 'center',
    dataIndex: 'createTime',
    sorter: true,
  },
  {
    title: '更新日期',
    align: 'center',
    dataIndex: 'updateTime',
    sorter: true,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '树形展示',
    field: 'isTree',
    component: 'Switch',
    defaultValue: true,
    //colProps: {span: 6},
  },
  {
    label: '运行流程',
    field: 'chainId',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'lite_flow_chain,chain_name,id',
    },
    //colProps: {span: 6},
  },
  {
    label: '状态',
    field: 'instanceStatus',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'plugin_status',
    },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '配置',
    field: 'config',
    component: 'JCodeEditor',
    componentProps: {
      language: 'javascript',
      mode: 'application/json',
    },
  },
  {
    label: '实例参数',
    field: 'instanceParams',
    component: 'JCodeEditor',
    componentProps: {
      language: 'javascript',
      mode: 'application/json',
    },
  },
  {
    label: 'Redis消息ID',
    field: 'redisMessageId',
    component: 'Input',
  },
  {
    label: '实例状态',
    field: 'instanceStatus_dictText',
    component: 'Input',
    // componentProps: {
    //   dictCode: 'plugin_status',
    // },
  },
];

// 高级查询数据
export const superQuerySchema = {
  instanceParams: { title: '实例参数', order: 0, view: 'text', type: 'string' },
  chainId: { title: '流程ID', order: 1, view: 'list', type: 'string', dictTable: 'lite_flow_chain', dictCode: 'id', dictText: 'chain_name' },
  redisMessageId: { title: 'Redis消息ID', order: 2, view: 'text', type: 'string' },
  instanceStatus: { title: '实例状态', order: 3, view: 'text', type: 'string' },
  params: { title: '配置', order: 4, view: 'text', type: 'string' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
