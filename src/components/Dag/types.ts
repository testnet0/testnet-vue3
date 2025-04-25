export interface NodeIO {
  name: string;
  type: string;
  description?: string;
  validValues?: string[]; // 可选的有效值列表
}

// 资产类型枚举
export enum AssetType {
  Company = 'company',
  Domain = 'domain',
  Subdomain = 'sub_domain',
  IP = 'ip',
  Web = 'web',
  Port = 'port',
  API = 'api',
  Vul = 'vul',
}

// 端口类型定义
export interface PortConfig {
  id: string;
  name: string;
  type: AssetType | AssetType[];
}

// 节点配置定义
export interface NodeConfig {
  id: string;
  scriptId: string;
  name: string;
  type: string;
  shape: string;
  inputs?: PortConfig[];
  outputs?: PortConfig[];
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
  };
}

export interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 定义输入输出类型的兼容性
export const typeCompatibility: Record<string, string[]> = {
  domain: ['domain'],
  subdomain: ['subdomain', 'domain'],
  ip: ['ip'],
  port: ['port'],
  url: ['url'],
  string: ['string', 'domain', 'subdomain', 'ip', 'port', 'url'],
  'string[]': ['string[]', 'subdomain', 'ip'],
  number: ['number', 'port'],
  'number[]': ['number[]', 'port'],
  object: ['object'],
  boolean: ['boolean'],
};
