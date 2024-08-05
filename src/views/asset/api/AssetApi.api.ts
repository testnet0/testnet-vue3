import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

export enum Api {
  list = '/testnet.server/assetApi/list',
  save = '/testnet.server/assetApi/add',
  edit = '/testnet.server/assetApi/edit',
  deleteApiOne = '/testnet.server/assetApi/delete',
  deleteApiBatch = '/testnet.server/assetApi/deleteBatch',
  importExcel = '/testnet.server/assetApi/importExcel',
  exportXls = '/testnet.server/assetApi/exportXls',
  queryRootTreeSync = '/testnet.server/assetApiTree/loadTreeRoot',
  queryChildTreeSync = '/testnet.server/assetApiTree/loadTreeChildren',
  deleteApiTreeBatch = '/testnet.server/assetApiTree/deleteBatch',
}

/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;

/**
 * 删除单个
 */
export const deleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteApiOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const batchDelete = (params,handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.deleteApiBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};

/**
 * 批量删除
 * @param params
 */
export const batchDeleteApiTree = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.deleteApiTreeBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  const url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};

/**
 * 获取API列表
 */
export const list = (params?) => defHttp.get({ url: Api.list, params });

/**
 * 获取树列表
 */
export const queryChildTreeSync = (params?) =>
  defHttp.get({ url: Api.queryChildTreeSync, params }).then((res) => {
    return res.map((node) => ({
      ...node,
      isLeaf: node.leaf,
    }));
  });

/**
 * 获取树列表
 */
export const queryRootTreeSync = (params?) =>
  defHttp.get({ url: Api.queryRootTreeSync, params }).then((res) => {
    return res;
  });
