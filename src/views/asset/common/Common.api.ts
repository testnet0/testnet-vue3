import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum CommonApi {
  deleteBySearch = '/testnet.server/asset/common/deleteBySearch',
}

/**
 * 批量运行
 * @param params
 */
export const batchDeleteBySearch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '包括当前查询条件所有资产',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.post({ url: CommonApi.deleteBySearch, params }).then(() => {
        handleSuccess();
      });
    },
  });
};