import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '节点',
    align: 'center',
    dataIndex: 'clientId_dictText',
  },
  {
    title: '流程',
    align: 'center',
    dataIndex: 'chainId_dictText',
  },
  {
    title: '最大并发数量',
    align: 'center',
    dataIndex: 'maxThreads',
  },
  {
    title: '配置类型',
    align: 'center',
    dataIndex: 'configFile',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '流程配置', value: 'N' },
        { text: '配置文件', value: 'Y' },
      ]);
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
    },
    //colProps: {span: 6},
  },
  {
    label: '流程',
    field: 'chainId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'lite_flow_chain,chain_name,id',
    },
    //colProps: {span: 6},
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '节点',
    field: 'clientId',
    helpMessage: '选择节点',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'client,client_name,id',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入节点!' }];
    },
  },
  {
    label: '配置类型',
    field: 'configFile',
    component: 'JSwitch',
    helpMessage: '流程配置：指定流程使用的配置 YAML格式 配置文件：指定客户端使用的配置文件',
    componentProps: {
      //非选中时的内容
      unCheckedChildren: '工作流配置',
      //选中时的内容
      checkedChildren: '配置文件',
    },
  },
  {
    label: '配置文件路径',
    field: 'configPath',
    component: 'Input',
    helpMessage: '指定客户端使用的配置文件实际路径',
    ifShow(renderCallbackParams) {
      return renderCallbackParams.values.configFile == 'Y';
    },
  },
  {
    label: '工作流',
    field: 'chainId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'lite_flow_chain,chain_name,id',
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择工作流!' }];
    },
    ifShow(renderCallbackParams) {
      return renderCallbackParams.values.configFile == 'N';
    },
  },
  {
    label: '并发数量',
    field: 'maxThreads',
    component: 'InputNumber',
    helpMessage: '指定客户端运行工作流的最大线程数量',
    ifShow(renderCallbackParams) {
      return renderCallbackParams.values.configFile == 'N';
    },
  },
  {
    label: '配置内容',
    field: 'config',
    component: 'JCodeEditor',
    componentProps: {
      language: 'yaml',
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
  param: { title: '参数', order: 1, view: 'text', type: 'string' },
  chainId: { title: '流程', order: 2, view: 'list', type: 'string', dictTable: 'lite_flow_chain', dictCode: 'id', dictText: 'chain_name' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
