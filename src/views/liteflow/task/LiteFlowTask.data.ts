import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { getWeekMonthQuarterYear } from '/@/utils';
import { JCronValidator } from '@/components/Form';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { useMessage } from '@/hooks/web/useMessage';
import { changeScriptStatus } from '@/views/liteflow/scripts/Script.api';
import {changeAlarmStatus, changeCronStatus} from '@/views/liteflow/task/LiteFlowTask.api';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '扫描任务名称',
    align: 'center',
    dataIndex: 'taskName',
    width: 200,
    resizable: true,
  },
  {
    title: '流程',
    align: 'center',
    dataIndex: 'chainId_dictText',
  },
  {
    title: '扫描资产类型',
    align: 'center',
    dataIndex: 'assetType_dictText',
  },
  {
    title: '资产数量',
    align: 'center',
    dataIndex: 'assetNum',
  },
  {
    title: '历史运行次数',
    align: 'center',
    dataIndex: 'version',
  },
  {
    title: '查询参数',
    align: 'center',
    dataIndex: 'searchParam',
  },
  {
    title: '待执行任务数量',
    align: 'center',
    dataIndex: 'unFinishedChain',
  },
  {
    title: '优先级',
    align: 'center',
    dataIndex: 'priority',
  },
  {
    title: '资产ID',
    align: 'center',
    dataIndex: 'assetId',
  },
  {
    title: '定时执行',
    align: 'center',
    dataIndex: 'isCron',
    customRender: ({ record }) => {
      return h(Switch, {
        checked: record.isCron == 1,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          const { createMessage } = useMessage();
          record.pendingStatus = true;
          if (!record.jobCron || record.jobCron === '') {
            createMessage.error('修改定时状态失败，请先在编辑中设置定时任务表达式！');
            record.pendingStatus = false;
            return;
          }
          const newStatus = checked ? true : false;
          changeCronStatus(record.id, newStatus)
            .then(() => {
              record.isCron = newStatus;
            })
            .catch(() => {
              createMessage.error('修改定时状态失败！');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: 'CRON表达式',
    align: 'center',
    dataIndex: 'jobCron',
  },
  // {
  //   title: '执行通知',
  //   align: 'center',
  //   dataIndex: 'isAlarm',
  //   customRender: ({ record }) => {
  //     return h(Switch, {
  //       checked: record.isAlarm == 1,
  //       checkedChildren: '已启用',
  //       unCheckedChildren: '已禁用',
  //       loading: record.pendingStatus,
  //       onChange(checked: boolean) {
  //         const { createMessage } = useMessage();
  //         record.pendingStatus = true;
  //         const newStatus = checked ? true : false;
  //         changeAlarmStatus(record.id, newStatus)
  //           .then(() => {
  //             record.isCron = newStatus;
  //           })
  //           .catch(() => {
  //             createMessage.error('修改任务通知状态失败！');
  //           })
  //           .finally(() => {
  //             record.pendingStatus = false;
  //           });
  //       },
  //     });
  //   },
  // },
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
    field: 'taskName',
    label: '扫描任务名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'chainId',
    label: '流程',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'lite_flow_chain,chain_name,id',
      mode: 'multiple',
    },
    colProps: { span: 6 },
  },
  {
    field: 'assetType',
    label: '扫描资产类型',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'asset_type',
      mode: 'multiple',
    },
    colProps: { span: 6 },
  },
  {
    field: 'isCron',
    label: '定时执行',
    component: 'JDictSelectTag',
    componentProps: {
      options: [
        {
          label: '是',
          value: 1,
          key: '1',
        },
        {
          label: '否',
          value: 0,
          key: '0',
        },
      ],
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '任务名称',
    field: 'taskName',
    component: 'Input',
  },
  {
    label: '优先级',
    field: 'priority',
    component: 'InputNumber',
  },
  {
    label: '流程',
    field: 'chainId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'lite_flow_chain,chain_name,id',
    },
    dynamicDisabled: true,
  },
  {
    label: '路由策略',
    field: 'router',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'router',
    },
    helpMessage: '轮询：节点轮流执行任务 指定：指定一个节点执行',
    required: true,
    defaultValue: '0',
  },
  {
    label: '节点',
    field: 'clientId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'client,client_name,id',
    },
    ifShow(renderCallbackParams) {
      return renderCallbackParams.values.router == '1';
    },
    //colProps: {span: 6},
  },
  {
    label: '查询参数',
    field: 'searchParam',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '扫描资产类型',
    field: 'assetType',
    component: 'JDictSelectTag',
    dynamicDisabled: true,
    componentProps: {
      dictCode: 'asset_type',
    },
  },
  {
    label: '资产数量',
    field: 'assetNum',
    component: 'InputNumber',
    dynamicDisabled: true,
  },
  {
    label: '定时执行',
    field: 'isCron',
    component: 'JSwitch',
    componentProps: {
      options: [1, 0],
    },
  },
  {
    field: 'jobCron',
    label: 'Cron表达式',
    component: 'JEasyCron',
    defaultValue: '* * * * * ? *',
    rules: [{ required: true, message: '请输入Cron表达式' }, { validator: JCronValidator }],
    ifShow: ({ values }) => {
      return values.isCron == 1;
    },
  },
  // {
  //   label: '执行通知',
  //   field: 'isAlarm',
  //   component: 'JSwitch',
  //   componentProps: {
  //     options: ['1', '0'],
  //   },
  // },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '',
    field: 'quartzJobId',
    component: 'Input',
    show: false,
  },
];
//子表单数据
//子表列表数据
export const liteFlowSubTaskColumns: BasicColumn[] = [
  {
    title: '执行节点',
    align: 'center',
    dataIndex: 'clientId_dictText',
  },
  {
    title: '任务状态',
    align: 'center',
    dataIndex: 'taskStatus_dictText',
  },
  {
    title: '参数',
    align: 'center',
    dataIndex: 'config',
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
  },
  {
    title: '更新时间',
    align: 'center',
    dataIndex: 'updateTime',
  },
];
//子表表格配置
export const liteFlowSubTaskJVxeColumns: JVxeColumn[] = [
  {
    title: '子任务参数',
    key: 'subTaskParam',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '任务状态',
    key: 'taskStatus',
    type: JVxeTypes.select,
    options: [],
    dictCode: 'plugin_status',
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '执行节点',
    key: 'clientId',
    type: JVxeTypes.select,
    options: [],
    dictCode: 'client,client_name,id',
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '资产类型',
    key: 'assetType',
    type: JVxeTypes.select,
    options: [],
    dictCode: 'asset_type',
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '优先级',
    key: 'priority',
    type: JVxeTypes.select,
    options: [],
    dictCode: 'priority',
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '任务',
    key: 'taskId',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '参数',
    key: 'config',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
];

// 高级查询数据
export const superQuerySchema = {
  taskName: { title: '任务名称', order: 0, view: 'text', type: 'string' },
  searchParam: { title: '查询参数', order: 1, view: 'text', type: 'string' },
  assetType: { title: '资产类型', order: 2, view: 'list', type: 'string', dictCode: 'asset_type' },
  assetNum: { title: '资产数量', order: 3, view: 'number', type: 'number' },
  isCron: { title: '定时执行', order: 5, view: 'number', type: 'number' },
  // isAlarm: { title: '执行通知', order: 7, view: 'number', type: 'number' },
  chainId: { title: '流程', order: 8, view: 'list', type: 'string', dictTable: 'lite_flow_chain', dictCode: 'id', dictText: 'chain_name' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
