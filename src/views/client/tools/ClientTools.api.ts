import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/cn/clientTools/list',
  save = '/cn/clientTools/add',
  edit = '/cn/clientTools/edit',
  deleteOne = '/cn/clientTools/delete',
  deleteBatch = '/cn/clientTools/deleteBatch',
  importExcel = '/cn/clientTools/importExcel',
  exportXls = '/cn/clientTools/exportXls',
  installTools = '/cn/clientTools/installTools',
  changeToolStatus = '/cn/clientTools/changeToolStatus',
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
 * 安装工具
 */
export const installTools = (params, handleSuccess) => {
  console.log(params);
  return defHttp.post({ url: Api.installTools, data: params }).then(() => {
    handleSuccess();
  });
};


/**
 * 批量安装
 * @param params
 */
export const batchInstallTools = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认安装',
    content: '是否安装选中工具',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.post({ url: Api.installTools,params }).then(() => {
        handleSuccess();
      });
    },
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
      return defHttp.delete({ url: Api.deleteBatch, params }, { joinParamsToUrl: true }).then(() => {
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

export const changeToolStatus = (id: number, status: boolean) => defHttp.get({ url: Api.changeToolStatus, params: { id, status } });
