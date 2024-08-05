import { defHttp } from '/src/utils/http/axios';
import { useMessage } from '/src/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/testnet.server/script/list',
  save = '/testnet.server/script/add',
  edit = '/testnet.server/script/edit',
  deleteOne = '/testnet.server/script/delete',
  deleteBatch = '/testnet.server/script/deleteBatch',
  importExcel = '/testnet.server/script/importExcel',
  exportXls = '/testnet.server/script/exportXls',
  copyScript = '/testnet.server/script/copyScript',
  changeScriptStatus = '/testnet.server/script/changeStatus',
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
 * 复制script
 */
export const copyScript = (params, handleSuccess) => {
  return defHttp.get({ url: Api.copyScript, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};

export const changeScriptStatus = (id: number, status: boolean) => defHttp.get({ url: Api.changeScriptStatus, params: { id, status } });
