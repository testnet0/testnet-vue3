import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { useMessage } from '@/hooks/web/useMessage';
import { changeToolStatus } from '@/views/client/tools/ClientTools.api';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '节点',
    align: 'center',
    dataIndex: 'clientId_dictText',
  },
  {
    title: '工具',
    align: 'center',
    dataIndex: 'scriptId_dictText',
  },
  {
    title: '安装状态',
    align: 'center',
    dataIndex: 'status',
    filters: [
      { text: '已安装', value: 'true' },
      { text: '未安装', value: 'false' },
    ],
    customRender: ({ text }) => {
      const color = text ? 'green' : 'red';
      return render.renderTag(text ? '已安装' : '未安装', color);
    },
  },
  {
    title: '版本',
    align: 'center',
    dataIndex: 'version',
  },
  {
    title: '自动安装',
    align: 'center',
    dataIndex: 'autoInstall',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'autoInstall')) {
        record.autoInstall = false;
      }
      return h(Switch, {
        checked: record.autoInstall,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked;
          const { createMessage } = useMessage();
          changeToolStatus(record.id, newStatus)
            .then(() => {
              record.autoInstall = newStatus;
            })
            .catch(() => {
              createMessage.error('修改安装状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '节点',
    field: 'clientId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'client,client_name,id',
      mode: 'multiple',
    },
    //colProps: {span: 6},
  },
  {
    label: '工具',
    field: 'scriptId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'lite_flow_script,script_name,id',
      mode: 'multiple',
    },
    //colProps: {span: 6},
  },
  {
    label: '安装状态',
    field: 'status',
    component: 'JSelectInput',
    componentProps: {
      options: [
        { label: '已安装', value: true },
        { label: '未安装', value: false },
      ],
    },
    //colProps: {span: 6},
  },
  {
    label: '版本',
    field: 'version',
    component: 'Input',
    //colProps: {span: 6},
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '节点',
    field: 'clientId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'client,client_name,id',
    },
  },
  {
    label: '工具',
    field: 'scriptId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'lite_flow_script,script_name,id',
    },
  },
  {
    label: '安装状态',
    field: 'status',
    component: 'JSelectInput',
    defaultValue: false,
    dynamicDisabled: true,
    componentProps: {
      options: [
        {
          label: '已安装',
          value: true,
        },
        {
          label: '未安装',
          value: false,
        },
      ],
    },
  },
  {
    label: '版本',
    field: 'version',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '自动安装',
    field: 'autoInstall',
    component: 'JSwitch',
    defaultValue: false,
    componentProps: {
      options: [true, false],
    },
  },
  {
    label: '安装命令',
    field: 'installCommand',
    component: 'JCodeEditor',
    componentProps: {
      height: '100px',
      fullScreen: true,
      language: 'shell',
    },
  },
  {
    label: '版本检查命令',
    field: 'versionCheckCommand',
    component: 'JCodeEditor',
    componentProps: {
      height: '100px',
      fullScreen: true,
      language: 'shell',
    },
  },
  {
    label: '版本更新命令',
    field: 'updateCommand',
    component: 'JCodeEditor',
    componentProps: {
      height: '100px',
      fullScreen: true,
      language: 'shell',
    },
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
  clientId: { title: '节点', order: 0, view: 'list', type: 'string', dictTable: 'client', dictCode: 'id', dictText: 'client_name' },
  scriptId: { title: '工具', order: 1, view: 'list', type: 'string', dictTable: 'lite_flow_chain', dictCode: 'id', dictText: 'chain_name' },
  status: { title: '安装状态', order: 2, view: 'number', type: 'number' },
  version: { title: '版本', order: 3, view: 'text', type: 'string' },
  needInstall: { title: '需安装', order: 4, view: 'number', type: 'number' },
  installCommand: { title: '安装命令', order: 5, view: 'text', type: 'string' },
  versionCheckCommand: { title: '版本检查命令', order: 6, view: 'text', type: 'string' },
  updateCommand: { title: '版本更新命令', order: 7, view: 'text', type: 'string' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
