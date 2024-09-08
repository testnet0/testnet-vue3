import { BasicColumn } from '/src/components/Table';
import { FormSchema } from '/src/components/Table';
import { rules } from '/src/utils/helper/validator';
import { render } from '/src/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '节点名称',
    align: 'center',
    dataIndex: 'clientName',
  },
  {
    title: '节点版本',
    align: 'center',
    dataIndex: 'clientVersion',
  },
  {
    title: '在线',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y' },
        { text: '否', value: 'N' },
      ]);
    },
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
  },
  {
    title: '状态更新时间',
    align: 'center',
    dataIndex: 'updateTime',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '节点名称',
    field: 'clientName',
    component: 'Input',
    //colProps: {span: 6},
  },
  {
    label: '节点版本',
    field: 'clientVersion',
    component: 'Input',
    //colProps: {span: 6},
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '节点名称',
    field: 'clientName',
    component: 'Input',
  },
  {
    label: '节点版本',
    field: 'clientVersion',
    component: 'Input',
  },
  {
    label: '节点状态',
    field: 'status',
    component: 'JSwitch',
    componentProps: {},
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
