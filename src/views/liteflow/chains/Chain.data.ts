import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Icon } from '/@/components/Icon';

import { changeChainStatus } from '@/views/liteflow/chains/Chain.api';
import { Switch } from 'ant-design-vue';
import { useMessage } from '@/hooks/web/useMessage';
import { defHttp } from '@/utils/http/axios';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '流程名称',
    align: 'center',
    dataIndex: 'chainName',
    resizable: true,
  },
  {
    title: '流程图标',
    align: 'center',
    dataIndex: 'icon',
    customRender: ({ record }) => {
      return h(Icon, { icon: record.icon });
    },
  },
  // {
  //   title: '路由策略',
  //   align: 'center',
  //   dataIndex: 'router_dictText',
  // },
  {
    title: '结果处理类名',
    align: 'center',
    dataIndex: 'processorClassName',
    resizable: true,
  },
  {
    title: '启用',
    align: 'center',
    dataIndex: 'enable',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.enable,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? true : false;
          const { createMessage } = useMessage();
          changeChainStatus(record.id, newStatus, 'enable')
            .then(() => {
              record.enable = newStatus;
            })
            .catch(() => {
              createMessage.error('修改状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '适用资产',
    align: 'center',
    dataIndex: 'assetType_dictText',
  },

  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
    sorter: true,
  },
  {
    title: '更新时间',
    align: 'center',
    dataIndex: 'updateTime',
    sorter: true,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '流程名称',
    field: 'chainName',
    component: 'Input',
    //colProps: {span: 6},
  },
  {
    label: '是否启用',
    field: 'enable',
    component: 'JSwitch',
    componentProps: {
      query: true,
      options: ['1', '0'],
    },
    //colProps: {span: 6},
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '流程名称',
    field: 'chainName',
    component: 'Input',
    required: true,
  },
  {
    label: '图标',
    field: 'icon',
    component: 'IconPicker',
  },
  {
    label: '适用资产',
    field: 'assetType',
    component: 'JSelectMultiple',
    helpMessage: '指定流程适用哪些资产类型，选择后会出现在对应资产的任务列表中',
    componentProps: {
      dictCode: 'asset_type',
    },
  },
  // {
  //   label: '路由策略',
  //   field: 'router',
  //   component: 'JDictSelectTag',
  //   componentProps: {
  //     dictCode: 'router',
  //   },
  //   helpMessage: '广播：所有在线节点都执行一次 随机：随机选择一个在线节点执行 轮询：轮流节点执行任务 指定：指定一个节点执行',
  //   required: true,
  //   defaultValue: '1',
  // },
  // {
  //   label: '节点',
  //   field: 'clientId',
  //   component: 'JDictSelectTag',
  //   componentProps: {
  //     dictCode: 'client,client_name,id',
  //   },
  //   ifShow(renderCallbackParams) {
  //     return renderCallbackParams.values.router == '2';
  //   },
  //   //colProps: {span: 6},
  // },
  {
    label: '结果处理类名',
    field: 'processorClassName',
    component: 'ApiSelect',
    helpMessage: '指定客户端的返回结果由服务端那个类进行处理',
    componentProps: {
      api: () => defHttp.get({ url: '/testnet.server/chain/getProcessList' }),
      //返回结果字段
      //标题字段
      labelField: 'text',
      //值字段
      valueField: 'value',
      resultField: 'result',
    },
  },
  {
    label: 'EL表达式',
    field: 'elData',
    component: 'InputTextArea',
    required: true,
  },
  {
    label: '默认线程',
    field: 'defaultThread',
    required: true,
    helpMessage: '默认线程，当节点未配置时，使用默认配置',
    component: 'InputNumber',
  },
  {
    label: '默认配置',
    field: 'config',
    helpMessage: '默认配置，当节点未配置时，使用默认配置',
    component: 'JCodeEditor',
    componentProps: {
      language: 'yaml',
    },
  },
  {
    label: '应用名',
    field: 'applicationName',
    defaultValue: 'testnet-client',
    component: 'Input',
    show: false,
  },
  {
    label: '启用',
    field: 'enable',
    component: 'JSwitch',
    defaultValue: true,
    componentProps: {
      options: [true, false],
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
  chainName: { title: '流程名称', order: 0, view: 'text', type: 'string' },
  elData: { title: 'EL表达式', order: 1, view: 'textarea', type: 'string' },
  router: { title: '路由策略', order: 10, view: 'list', type: 'string', dictCode: 'router' },
  applicationName: { title: '客户端名称', order: 2, view: 'text', type: 'string' },
  enable: { title: '启用', order: 3, view: 'number', type: 'number' },
  assetType: { title: '适用资产', order: 5, view: 'list_multi', type: 'string', dictCode: 'asset_type' },
  // runOnUpdate: { title: '更新时自动运行', order: 7, view: 'number', type: 'number' },
  // runOnInsert: { title: '新增时自动运行', order: 8, view: 'number', type: 'number' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
