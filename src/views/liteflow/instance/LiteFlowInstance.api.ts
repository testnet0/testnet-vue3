import {defHttp} from "/@/utils/http/axios";
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/cn.iotaa/liteFlowInstance/rootList',
  save='/cn.iotaa/liteFlowInstance/add',
  edit='/cn.iotaa/liteFlowInstance/edit',
  deleteLiteFlowInstance = '/cn.iotaa/liteFlowInstance/delete',
  importExcel = '/cn.iotaa/liteFlowInstance/importExcel',
  exportXls = '/cn.iotaa/liteFlowInstance/exportXls',
  loadTreeData = '/cn.iotaa/liteFlowInstance/loadTreeRoot',
  getChildList = '/cn.iotaa/liteFlowInstance/childList',
  getChildListBatch = '/cn.iotaa/liteFlowInstance/getChildListBatch',
  queryLogByPluginInstanceId = '/cn.iotaa/liteFlowInstance/queryLogById',
  cancelInstance = '/cn.iotaa/liteFlowInstance/cancelInstance',
}

/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 * @param params
 */
export const getImportUrl = Api.importExcel;
/**
 * 列表接口
 * @param params
 */
export const list = (params) =>
  defHttp.get({url: Api.list, params});
/**
 * 删除
 */
export const deleteLiteFlowInstance = (params,handleSuccess) => {
  return defHttp.delete({url: Api.deleteLiteFlowInstance, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 批量删除
 * @param params
 */
export const batchDeleteLiteFlowInstance = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.deleteLiteFlowInstance, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdateDict = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({url: url, params});
}
/**
 * 查询全部树形节点数据
 * @param params
 */
export const loadTreeData = (params) =>
  defHttp.get({url: Api.loadTreeData,params});
/**
 * 查询子节点数据
 * @param params
 */
export const getChildList = (params) =>
  defHttp.get({url: Api.getChildList, params});
/**
 * 批量查询子节点数据
 * @param params
 */
export const getChildListBatch = (params) =>
  defHttp.get({url: Api.getChildListBatch, params},{isTransformResponse:false});


/**
 * 取消单个任务
 */
export const cancelInstance = (params, handleSuccess) => {
  return defHttp.get({ url: Api.cancelInstance, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};

/**
 * 获取插件实例日志
 */
export const getPluginInstanceLog = (params) => {
  return defHttp.get({ url: Api.queryLogByPluginInstanceId, params }, { joinParamsToUrl: true }).then((response) => {
    if (response.records) {
      const logs = response.records;
      return logs;
    } else {
      // 如果 logs 字段不存在或响应数据为空，你可以返回一个默认值或者空数组
      return [];
    }
  });
};
