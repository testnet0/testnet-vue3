import { defHttp } from '/@/utils/http/axios';

export enum Api {
  search = '/testnet.server/asset/search',
  import = '/testnet.server/asset/import',
}

/**

/**
 * 获取API列表
 */
export const search = (params) => {
  return defHttp.post({
    url: Api.search,
    timeout: 1000 * 60 * 2,
    params,
  });
};

/**
 * 获取API列表
 */
export const assetImport = (params) => {
  return defHttp.post({
    url: Api.import,
    timeout: 1000 * 60 * 2,
    params,
  });
};


