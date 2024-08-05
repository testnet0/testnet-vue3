import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/testnet.server/chain/list',
  save = '/testnet.server/chain/add',
  edit = '/testnet.server/chain/edit',
  deleteOne = '/testnet.server/chain/delete',
  deleteBatch = '/testnet.server/chain/deleteBatch',
  importExcel = '/testnet.server/chain/importExcel',
  exportXls = '/testnet.server/chain/exportXls',
  queryByAssetType = '/testnet.server/chain/queryByAssetType',
  runTargetChain = '/testnet.server/chain/runTargetChain',
  batchRunChain = '/testnet.server/chain/batchRunTargetChain',
  copyChain = '/testnet.server/chain/copyChain',
  changeChainStatus = '/testnet.server/chain/changeStatus',
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
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 删除单个
 */
export const deleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const batchDelete = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.deleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
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
 * 列表接口
 * @param params
 */
export const queryByAssetType = (params) => defHttp.get({ url: Api.queryByAssetType, params });

export const runChain = (params) => {
  return defHttp.post({ url: Api.batchRunChain, params });
};

/**
 * 复制chain
 */
export const copyChain = (params, handleSuccess) => {
  return defHttp.get({ url: Api.copyChain, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};

/**
 * 批量运行
 * @param params
 */
export const batchRunChain = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: params.data.length > 0 ? `资产数量：${params.data.length}` : '创建扫描任务《 ' + params.chainName + ' 》',
    content: params.data.length > 0 ? '立即执行' + params.chainName + '扫描任务?' : '包括当前查询条件所有资产',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.post({ url: Api.batchRunChain, params }).then(() => {
        handleSuccess();
      });
    },
  });
};

// changeChainStatus
export const changeChainStatus = (id: number, status: boolean, field: string) =>
  defHttp.get({ url: Api.changeChainStatus, params: { id, status, field } });
