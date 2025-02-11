import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
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
      const statusColorMap = {
        Y: { color: 'green', text: '是' },
        N: { color: 'red', text: '否' },
      };

      const { color, text: statusText } = statusColorMap[text] || {};

      // 假设 render.renderTag 接受两个参数：文本和颜色
      return render.renderTag(statusText, color);
    },
  },
  {
    title: 'CPU',
    align: 'center',
    dataIndex: 'cpuUsage',
    customRender: ({ record }) => {
      const cpuUsage = record.cpuUsage;
      return `${cpuUsage.toFixed(0)} %`;
    },
  },
  {
    title: '内存',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ record }) => {
      const freeMemory = record.freeMemory;
      const totalMemory = record.totalMemory;
      const usedMemory = totalMemory - freeMemory;
      return `${usedMemory.toFixed(0)} / ${totalMemory.toFixed(0)} MB`;
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
