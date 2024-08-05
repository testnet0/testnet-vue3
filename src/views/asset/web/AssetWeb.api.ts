import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/testnet.server/assetWeb/list',
  save = '/testnet.server/assetWeb/add',
  edit = '/testnet.server/assetWeb/edit',
  deleteOne = '/testnet.server/assetWeb/delete',
  deleteBatch = '/testnet.server/assetWeb/deleteBatch',
  importExcel = '/testnet.server/assetWeb/importExcel',
  exportXls = '/testnet.server/assetWeb/exportXls',
  getWebBody = '/testnet.server/assetWeb/getWebBody',
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
 * 获取资产Body
 */
export const getWebBody = (params) => {
  return defHttp.get({ url: Api.getWebBody, params }, { joinParamsToUrl: true }).then((response) => {
    return response;
  });
};

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
