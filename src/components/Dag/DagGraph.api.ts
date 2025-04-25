import { defHttp } from '/@/utils/http/axios';
import type { NodeConfig } from './types';

enum Api {
  getNodeList = '/testnet.server/workflow/getNodeList',
  saveWorkflow = '/testnet.server/workflow/saveWorkflow',
  getWorkflowById = '/testnet.server/workflow/getById',
  queryScriptNodes = '/testnet.server/script/getNodeList',
}

/**
 * 获取节点列表
 * @param params
 */
export const getNodeList = (params) => defHttp.get<NodeConfig[]>({ url: Api.getNodeList, params });

/**
 * 根据ID获取工作流
 * @param id 工作流ID
 */
export const getWorkflowById = (id: string) => defHttp.get({ url: Api.getWorkflowById, params: { id } });

/**
 * 保存工作流
 * @param params 工作流数据
 */
export const saveWorkflow = (params) => defHttp.post({ url: Api.saveWorkflow, params });

/**
 * 获取所有支持的脚本节点
 */
export const queryScriptNodes = () => defHttp.get({ url: Api.queryScriptNodes });

/**
 * 将API返回的节点数据转换为NodeConfig格式
 * @param apiNodes API返回的节点数据
 */
export const convertApiNodesToNodeConfig = (apiNodes: any[]): NodeConfig[] => {
  if (!apiNodes || !apiNodes.length) return [];

  return apiNodes.map((node) => {
    // 处理多个输入类型
    const inputTypes = typeof node.inputAsset === 'string' ? node.inputAsset.split(',').map((type) => type.trim()) : [node.inputAsset];

    // 处理多个输出类型
    const outputTypes = typeof node.outputAsset === 'string' ? node.outputAsset.split(',').map((type) => type.trim()) : [node.outputAsset];

    return {
      id: node.id,
      scriptId: node.scriptId,
      name: node.name,
      type: node.type || 'asset',
      shape: node.shape || 'dynamic-node',
      inputs: [
        {
          id: 'in-0',
          name: '输入',
          type: inputTypes,
        },
      ],
      outputs: [
        {
          id: 'out-0',
          name: '输出',
          type: outputTypes,
        },
      ],
      style: {
        backgroundColor: '#fff',
        borderColor: '#1890ff',
        textColor: '#1890ff',
      },
      // 保存原始数据，以便后续使用
      rawData: node,
    };
  });
};
