import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { changeScriptStatus } from '@/views/liteflow/scripts/Script.api';
import { Switch } from 'ant-design-vue';
import { useMessage } from '@/hooks/web/useMessage';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '脚本分类',
    align: 'center',
    dataIndex: 'scriptDict_dictText',
    sorter: true,
  },
  {
    title: '脚本ID',
    align: 'center',
    dataIndex: 'scriptId',
  },
  {
    title: '脚本备注',
    align: 'center',
    dataIndex: 'scriptName',
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
          const newStatus = checked;
          const { createMessage } = useMessage();
          changeScriptStatus(record.id, newStatus)
            .then(() => {
              record.enable = newStatus;
            })
            .catch(() => {
              createMessage.error('修改脚本状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
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
    label: '脚本分类',
    field: 'scriptDict',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'script_dict',
    },
  },
  {
    label: '脚本ID',
    field: 'scriptId',
    component: 'Input',
    //colProps: {span: 6},
  },
  {
    label: '脚本名称',
    field: 'scriptName',
    component: 'Input',
    //colProps: {span: 6},
  },
  {
    label: '脚本类型',
    field: 'scriptType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'script_type',
    },
    //colProps: {span: 6},
  },
  {
    label: '脚本语言',
    field: 'scriptLanguage',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'script_language',
    },
    //colProps: {span: 6},
  },
  {
    label: '是否启用',
    field: 'enable',
    component: 'JSwitch',
    componentProps: {
      query: true,
      options: [true, false],
    },
    //colProps: {span: 6},
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '脚本分类',
    field: 'scriptDict',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'script_dict',
    },
  },
  {
    label: '脚本ID',
    field: 'scriptId',
    component: 'Input',
    required: true,
    helpMessage: '指定脚本的id，用于工作流编排',
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
  {
    label: '脚本备注',
    field: 'scriptName',
    component: 'Input',
    required: true,
  },
  {
    label: '运行于',
    field: 'applicationName',
    component: 'Input',
    defaultValue: 'testnet-client',
    show: false,
  },
  {
    label: '需安装',
    field: 'needInstall',
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
    ifShow(renderCallbackParams) {
      return renderCallbackParams.values.needInstall;
    },
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
    ifShow(renderCallbackParams) {
      return renderCallbackParams.values.needInstall;
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
    ifShow(renderCallbackParams) {
      return renderCallbackParams.values.needInstall;
    },
  },
  {
    label: '脚本类型',
    field: 'scriptType',
    component: 'JDictSelectTag',
    required: true,
    componentProps: {
      dictCode: 'script_type',
    },
  },
  {
    label: '脚本语言',
    field: 'scriptLanguage',
    component: 'JDictSelectTag',
    required: true,
    componentProps: {
      dictCode: 'script_language',
    },
  },
  {
    label: '脚本内容',
    field: 'scriptData',
    component: 'JCodeEditor',
    defaultValue:
      'import com.yomahub.liteflow.script.ScriptExecuteWrap;\n' +
      'import com.yomahub.liteflow.script.body.JaninoCommonScriptBody;\n' +
      'import com.yomahub.liteflow.spi.holder.ContextAwareHolder;\n' +
      'import testnet.client.service.ILiteFlowMessageSendService;\n' +
      'import testnet.common.entity.liteflow.TaskExecuteMessage;\n' +
      '\n' +
      '\n' +
      'public class demo implements JaninoCommonScriptBody {\n' +
      '    public Void body(ScriptExecuteWrap wrap) {\n' +
      '        TaskExecuteMessage taskExecuteMessage = (TaskExecuteMessage) wrap.cmp.getRequestData();\n' +
      '        try {\n' +
      '            ILiteFlowMessageSendService sendService = (ILiteFlowMessageSendService) ContextAwareHolder.loadContextAware().getBean(ILiteFlowMessageSendService.class);\n' +
      '            sendService.setTaskId(taskExecuteMessage.getTaskId());\n' +
      '            sendService.INFO("Welcome to TestNet! params is : {}", taskExecuteMessage.getConfig());\n' +
      '            sendService.INFO("Instance params is : {}", taskExecuteMessage.getTaskParams());\n' +
      '        } catch (Exception e) {\n' +
      '            throw new RuntimeException(e);\n' +
      '        }\n' +
      '        return null;\n' +
      '    }\n' +
      '}',
    required: true,
    componentProps: {
      height: '500px',
      fullScreen: true,
      language: 'text/x-java',
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
  scriptName: { title: '脚本名称', order: 0, view: 'text', type: 'string' },
  scriptType: { title: '脚本类型', order: 1, view: 'list', type: 'string', dictCode: 'script_type' },
  scriptData: { title: '脚本内容', order: 2, view: 'textarea', type: 'string' },
  scriptLanguage: {
    title: '脚本语言',
    order: 3,
    view: 'list',
    type: 'string',
    dictCode: 'script_language',
  },
  enable: { title: '启用', order: 4, view: 'number', type: 'number' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
