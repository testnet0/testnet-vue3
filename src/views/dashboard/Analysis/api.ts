import { defHttp } from '/@/utils/http/axios';

enum Api {
  loginfo = '/sys/loginfo',
  visitInfo = '/sys/visitInfo',
}
/**
 * 日志统计信息
 * @param params
 */
export const getLoginfo = (params) => defHttp.get({ url: Api.loginfo, params }, { isTransformResponse: false });
/**
 * 访问量信息
 * @param params
 */
export const getVisitInfo = (params) => defHttp.get({ url: Api.visitInfo, params }, { isTransformResponse: false });

export const getAssetData = (params) => defHttp.get({ url: '/testnet.server/dashboard/getCardData', params }, { isTransformResponse: false });

export const getScriptData = (params) => defHttp.get({ url: '/testnet.server/dashboard/getScriptData', params }, { isTransformResponse: false });
