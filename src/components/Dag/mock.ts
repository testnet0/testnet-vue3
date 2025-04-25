import { NodeConfig, AssetType } from './types';

// 节点类型枚举
export const NodeTypes = {
  START: 'start',
  END: 'end',
  ASSET_TYPE: 'asset_type',
  SCAN: 'scan',
  DNS: 'dns',
  PORT_SCAN: 'port_scan',
  VULNERABILITY_SCAN: 'vulnerability_scan',
  WEB_CRAWLER: 'web_crawler',
  SCREENSHOT: 'screenshot',
} as const;

// 数据类型枚举
export const DataTypes = {
  STRING: 'string',
  STRING_ARRAY: 'string[]',
  NUMBER: 'number',
  NUMBER_ARRAY: 'number[]',
  OBJECT: 'object',
  BOOLEAN: 'boolean',
  DOMAIN: 'domain',
  SUBDOMAIN: 'subdomain',
  IP: 'ip',
  PORT: 'port',
  URL: 'url',
} as const;

// Mock节点配置数据
export const mockNodes: NodeConfig[] = [
  {
    id: 'start',
    name: '开始',
    type: 'start',
    shape: 'dynamic-node',
    outputs: [
      {
        name: '资产类型',
        type: AssetType.Company,
      },
    ],
    style: {
      backgroundColor: '#e6f7ff',
      borderColor: '#1890ff',
      textColor: '#1890ff',
    },
  },
  {
    id: 'company-info',
    name: '公司信息',
    type: 'node',
    shape: 'dynamic-node',
    inputs: [
      {
        name: '公司',
        type: AssetType.Company,
      },
    ],
    outputs: [
      {
        name: '域名',
        type: AssetType.Domain,
      },
    ],
    style: {
      backgroundColor: '#fff',
      borderColor: '#1890ff',
      textColor: '#1890ff',
    },
  },
  {
    id: 'domain-scan',
    name: '域名扫描',
    type: 'node',
    shape: 'dynamic-node',
    inputs: [
      {
        name: '域名',
        type: AssetType.Domain,
      },
    ],
    outputs: [
      {
        name: '子域名',
        type: AssetType.Subdomain,
      },
    ],
    style: {
      backgroundColor: '#fff',
      borderColor: '#1890ff',
      textColor: '#1890ff',
    },
  },
  {
    id: 'subdomain-scan',
    name: '子域名扫描',
    type: 'node',
    shape: 'dynamic-node',
    inputs: [
      {
        name: '子域名',
        type: AssetType.Subdomain,
      },
    ],
    outputs: [
      {
        name: 'IP',
        type: AssetType.IP,
      },
      {
        name: 'Web',
        type: AssetType.Web,
      },
    ],
    style: {
      backgroundColor: '#fff',
      borderColor: '#1890ff',
      textColor: '#1890ff',
    },
  },
  {
    id: 'port-scan',
    name: '端口扫描',
    type: 'node',
    shape: 'dynamic-node',
    inputs: [
      {
        name: 'IP',
        type: AssetType.IP,
      },
    ],
    outputs: [
      {
        name: '端口',
        type: AssetType.Port,
      },
    ],
    style: {
      backgroundColor: '#fff',
      borderColor: '#1890ff',
      textColor: '#1890ff',
    },
  },
  {
    id: 'web-scan',
    name: 'Web扫描',
    type: 'node',
    shape: 'dynamic-node',
    inputs: [
      {
        name: 'Web',
        type: AssetType.Web,
      },
    ],
    outputs: [
      {
        name: 'API',
        type: AssetType.API,
      },
    ],
    style: {
      backgroundColor: '#fff',
      borderColor: '#1890ff',
      textColor: '#1890ff',
    },
  },
  {
    id: 'end',
    name: '结束',
    type: NodeTypes.END,
    shape: 'dynamic-node',
    inputs: [],
    outputs: [],
    style: {
      backgroundColor: '#fff1f0',
      borderColor: '#ff4d4f',
      textColor: '#ff4d4f',
    },
  },
];
