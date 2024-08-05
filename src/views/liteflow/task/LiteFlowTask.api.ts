import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/testnet/liteFlowTask/list',
  save = '/testnet/liteFlowTask/add',
  edit = '/testnet/liteFlowTask/edit',
  deleteOne = '/testnet/liteFlowTask/delete',
  deleteBatch = '/testnet/liteFlowTask/deleteBatch',
  importExcel = '/testnet/liteFlowTask/importExcel',
  exportXls = '/testnet/liteFlowTask/exportXls',
  liteFlowSubTaskList = '/testnet/liteFlowTask/queryLiteFlowSubTaskByMainId',
  queryLogBySubTaskId = '/testnet/liteFlowTask/queryLogBySubTaskId',
  executeAgain = '/testnet/liteFlowTask/executeAgain',
  stopTask = '/testnet/liteFlowTask/stopTask',
  changeCronStatus = '/testnet/liteFlowTask/changeCronStatus',
  changeAlarmStatus = '/testnet/liteFlowTask/changeAlarmStatus',
  cancelSubTask = '/testnet/liteFlowTask/cancelSubTask',
  noTreeList = '/testnet/liteFlowTask/subTaskList',
  deleteByTask = '/testnet/liteFlowTask/deleteByTask',
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
 * 子表单查询接口
 * @param params
 */
export const queryLiteFlowSubTask = Api.liteFlowSubTaskList;
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
 * 根据任务删除
 */
export const deleteByTask = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteByTask, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};

/**
 * 列表接口
 * @param params
 */
export const noTreeList = (params) => defHttp.get({ url: Api.noTreeList, params });

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
      return defHttp
        .delete(
          {
            url: Api.deleteBatch,
            data: params,
          },
          { joinParamsToUrl: true }
        )
        .then(() => {
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
 * 子表列表接口
 * @param params
 */
export const liteFlowSubTaskList = (params) =>
  defHttp.get(
    {
      url: Api.liteFlowSubTaskList,
      params,
    },
    { isTransformResponse: false }
  );

/**
 * 获取插件实例日志
 */
export const getSubTaskLog = (params) => {
  return defHttp.get(
    {
      url: Api.queryLogBySubTaskId,
      params,
    },
    { joinParamsToUrl: true }
  );
};

/**
 * 重复运行
 */
export const executeAgain = (params, handleSuccess) => {
  return defHttp.get({ url: Api.executeAgain, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};

/**
 * 停止运行
 */
export const stopTask = (params, handleSuccess) => {
  return defHttp.get({ url: Api.stopTask, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};

/**
 * 取消运行子任务
 */
export const cancelTask = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.cancelSubTask, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};

/**
 * 批量取消
 * @param params
 */
export const batchCancel = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认取消',
    content: '是否确认取消运行',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.cancelSubTask, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
export const changeCronStatus = (id: number, status: boolean) => defHttp.get({ url: Api.changeCronStatus, params: { id, status } });

export const changeAlarmStatus = (id: number, status: boolean) => defHttp.get({ url: Api.changeAlarmStatus, params: { id, status } });
