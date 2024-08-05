import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { h } from 'vue';
import { router } from '@/router';
import {createContextMenu} from "@/components/ContextMenu";

const handleContext = (e: MouseEvent, record: any) => {
  e.preventDefault();
  createContextMenu({
    event: e,
    items: [
      {
        label: 'Hunter搜索',
        icon: 'icon-park:search',
        handler: () => {
          router.push({
            path: '/testnet/search',
            query: {
              engine: 'hunter',
              keyword: `domain="${record.subDomain}"`,
            },
          });
        },
      },
      {
        label: 'Fofa搜索',
        icon: 'icon-park:font-search',
        handler: () => {
          router.push({
            path: '/testnet/search',
            query: {
              engine: 'fofa',
              keyword: `host="${record.subDomain}"`,
            },
          });
        },
      },
      {
        label: 'Quake搜索',
        icon: 'icon-park:doc-search',
        handler: () => {
          router.push({
            path: '/testnet/search',
            query: {
              engine: 'quake',
              keyword: `hostname:"${record.subDomain}"`,
            },
          });
        },
      },
      {
        label: 'Shodan搜索',
        icon: 'icon-park:folder-search',
        handler: () => {
          router.push({
            path: '/testnet/search',
            query: {
              engine: 'shodan',
              keyword: `hostname:"${record.subDomain}"`,
            },
          });
        },
      },
    ],
  });
};

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '项目',
    align: 'center',
    dataIndex: 'projectId_dictText',
    fixed: 'left',
    resizable: true,
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            router.push({
              path: '/testnet/projectList',
              query: {
                id: record.projectId ? record.projectId : '',
                t: new Date().getTime(),
              },
            });
          },
        },
        record.projectId_dictText ? record.projectId_dictText : ''
      );
    },
  },
  {
    title: '主域名',
    align: 'center',
    dataIndex: 'domainId_dictText',
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            router.push({
              path: '/testnet/assetDomainList',
              query: {
                id: record.domainId ? record.domainId : '',
                t: new Date().getTime(),
              },
            });
          },
        },
        record.domainId_dictText ? record.domainId_dictText : ''
      );
    },
  },
  {
    title: '子域名',
    align: 'center',
    dataIndex: 'subDomain',
    fixed: 'left',
    resizable: true,
    ellipsis: true,
    customRender: ({ record }) => {
      return h('a-button', { onContextmenu: (e: MouseEvent) => handleContext(e, record) }, record.subDomain ? record.subDomain : '');
    },
  },
  {
    title: '解析IP(开放端口)',
    align: 'center',
    dataIndex: 'ip', // 数据索引应与自定义渲染的属性一致
    resizable: true,
    customRender: ({ record }) => {
      if (!record.ipList || record.ipList.length === 0) {
        return '暂无'; // 如果ipList不存在或为空，直接返回"暂无"
      }
      return h(
        'div', // 创建一个容器div来包裹所有的a标签
        {
          style: { display: 'flex', flexDirection: 'column' }, // 使用flex布局，子元素自动换行
        },
        record.ipList.map((ipObj, index) => {
          return h(
            'a',
            {
              key: index, // 添加key以帮助React识别元素
              onClick: (event) => {
                event.preventDefault(); // 阻止默认行为，因为我们将手动处理跳转
                router.push({
                  path: '/testnet/assetIpList',
                  query: {
                    id: ipObj.id,
                    t: new Date().getTime(), // 时间戳，用于防缓存
                  },
                });
              },
            },
            `${ipObj.ip}(${ipObj.portCount})` // 显示IP和端口计数
          );
        })
      );
    },
  },
  {
    title: 'Web站点/状态码',
    align: 'center',
    dataIndex: 'web', // 数据索引应与自定义渲染的属性一致
    resizable: true,
    customRender: ({ record }) => {
      if (!record.assetWebVOList || record.assetWebVOList.length === 0) {
        return '暂无'; // 如果ipList不存在或为空，直接返回"暂无"
      }
      return h(
        'div', // 创建一个容器div来包裹所有的a标签
        {
          style: { display: 'flex', flexDirection: 'column' }, // 使用flex布局，子元素自动换行
        },
        record.assetWebVOList.map((webObject, index) => {
          return h(
            'a',
            {
              key: index, // 添加key以帮助React识别元素
              onClick: (event) => {
                event.preventDefault(); // 阻止默认行为，因为我们将手动处理跳转
                router.push({
                  path: '/testnet/assetWebList',
                  query: {
                    id: webObject.id,
                    t: new Date().getTime(), // 时间戳，用于防缓存
                  },
                });
              },
            },
            `${webObject.webTitle}(${webObject.statusCode})` // 显示IP和端口计数
          );
        })
      );
    },
  },
  {
    title: '解析类型',
    align: 'center',
    width: 80,
    dataIndex: 'type_dictText',
  },
  {
    title: '解析值',
    align: 'center',
    dataIndex: 'dnsRecord',
  },
  {
    title: 'name_server',
    align: 'center',
    dataIndex: 'nameServer',
  },
  {
    title: '域名等级',
    align: 'center',
    width: 80,
    dataIndex: 'level',
  },
  {
    title: '资产标签',
    align: 'center',
    dataIndex: 'assetLabel_dictText',
  },
  {
    title: '来源',
    align: 'center',
    width: 100,
    ellipsis: true,
    dataIndex: 'source',
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
    sorter: true,
  },
  {
    title: '更新时间',
    align: 'center',
    dataIndex: 'updateTime',
    sorter: true,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '项目',
    field: 'projectId',
    component: 'JSearchSelect',
    componentProps: {
      dict: 'project,project_name,id',
      async: true,
    },
    //colProps: {span: 6},
  },
  {
    label: '主域名',
    field: 'domainId',
    component: 'JPopupDict',
    componentProps: {
      placeholder: '请选择',
      dictCode: 'select_domain,domain,id',
      multi: true,
    },
  },
  // {
  //   label: '域名',
  //   field: 'domainId',
  //   component: 'JPopup',
  //   componentProps: ({ formActionType }) => {
  //     const { setFieldsValue } = formActionType;
  //     return {
  //       setFieldsValue,
  //       placeholder: '请选择',
  //       code: 'select_domain',
  //       fieldConfig: [
  //         { source: 'domain', target: 'domainId' },
  //         { source: 'project_id', target: 'projectId' },
  //       ],
  //     };
  //   },
  // },
  {
    label: '子域名',
    field: 'subDomain',
    component: 'Input',
    //colProps: {span: 6},
  },
  {
    label: 'IP',
    field: 'ip',
    component: 'JPopup',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue } = formActionType;
      return {
        setFieldsValue,
        placeholder: '请选择',
        code: 'select_ip',
        fieldConfig: [
          { source: 'ai_id', target: 'ip_id' },
          { source: 'ip', target: 'ip' },
          { source: 'project_id', target: 'projectId' },
        ],
      };
    },
  },
  {
    label: 'ip_id',
    field: 'ip_id',
    component: 'Input',
    show: false,
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '所属项目',
    field: 'projectId',
    component: 'JSearchSelect',
    componentProps: {
      dict: 'project,project_name,id',
      async: true,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入所属项目!' }];
    },
  },
  {
    label: '主域名',
    field: 'domainId',
    component: 'JPopupDict',
    componentProps: {
      placeholder: '请选择',
      dictCode: 'select_domain,domain,id',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择主域名!' }];
    },
  },
  {
    label: '子域名',
    field: 'subDomain',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入子域名!' }, ];
    },
  },
  {
    label: '解析IP',
    field: 'ips',
    component: 'Input',
  },
  {
    label: '解析类型',
    field: 'type',
    defaultValue: 'A',
    required: true,
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'dns_type',
      mode: 'multiple',
    },
  },
  {
    label: '解析值',
    field: 'dnsRecord',
    component: 'Input',
  },
  {
    label: 'name_server',
    field: 'nameServer',
    component: 'Input',
  },

  {
    label: '资产标签',
    field: 'assetLabel',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'asset_label,label_name,id',
      // getPopupContainer: (node) => node.parentNode,
    },
  },
  {
    label: '域名等级',
    field: 'level',
    dynamicDisabled: true,
    component: 'InputNumber',
    ifShow: ({ values }) => {
      return values.id != null;
    },
  },
  {
    label: '来源',
    field: 'source',
    defaultValue: '手工录入',
    component: 'Input',
    show: false,
  },
  {
    label: '项目id',
    field: 'projectId',
    component: 'Input',
    show: false,
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

// 高级查询数据
export const superQuerySchema = {
  projectId: { title: '所属项目', order: 0, view: 'sel_search', type: 'string', dictTable: 'project', dictCode: 'id', dictText: 'project_name' },
  subDomain: { title: '子域名', order: 0, view: 'text', type: 'string' },
  domainId: {
    title: '主域名',
    order: 1,
    view: 'sel_search',
    type: 'string',
    dictTable: 'asset_domain',
    dictCode: 'id',
    dictText: 'domain',
  },
  // ip: { title: '解析IP', order: 2, view: 'list_multi', type: 'string', dictTable: 'asset_ip', dictCode: 'id', dictText: 'ip' },
  type: { title: '解析类型', order: 3, view: 'list', type: 'string', dictCode: 'dns_type' },
  dnsRecord: { title: '解析值', order: 4, view: 'text', type: 'string' },
  nameServer: { title: 'name_server', order: 5, view: 'text', type: 'string' },
  level: { title: '域名等级', order: 7, view: 'number', type: 'number' },
  source: { title: '来源', order: 10, view: 'text', type: 'string' },
  createTime: { title: '创建时间', order: 12, view: 'date', type: 'string' },
  updateTime: { title: '更新时间', order: 13, view: 'date', type: 'string' },
  assetLabel: {
    title: '资产标签',
    order: 14,
    view: 'sel_search',
    type: 'string',
    dictTable: 'asset_label',
    dictCode: 'id',
    dictText: 'label_name',
  },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
