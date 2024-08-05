import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
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
              keyword: `ip="${record.ip}"`,
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
              keyword: `ip="${record.ip}"`,
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
              keyword: `ip:"${record.ip}"`,
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
              keyword: `ip:"${record.ip}"`,
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
    title: 'ip',
    align: 'center',
    dataIndex: 'ip',
    resizable: true,
    fixed: 'left',
    ellipsis: true,
    customRender: ({ record }) => {
      return h('a-button', { onContextmenu: (e: MouseEvent) => handleContext(e, record) }, record.ip ? record.ip : '');
    },
  },
  {
    title: '子域名',
    align: 'center',
    resizable: true,
    dataIndex: 'assetSubDomainList',
    customRender: ({ record }) => {
      if (!record.domainVOList || record.domainVOList.length === 0) {
        return '暂无';
      }
      return h(
        'div',
        {
          style: { display: 'flex', flexDirection: 'column' }, // 使用flex布局，子元素自动换行
        },
        record.domainVOList.map((domainObj, index) => {
          return h(
            'a',
            {
              key: index, // 添加key以帮助React识别元素
              onClick: (event) => {
                event.preventDefault();
                router.push({
                  path: '/testnet/assetSubdomainList',
                  query: {
                    id: domainObj.id,
                    t: new Date().getTime(), // 时间戳，用于防缓存
                  },
                });
              },
            },
            domainObj.subDomain
          );
        })
      );
    },
  },
  {
    title: '开放端口',
    align: 'center',
    dataIndex: 'portCount',
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            // 假设router是全局挂载的路由对象
            router.push({
              path: '/testnet/assetPortList',
              query: {
                ip: record.id, // 假设record.id是当前记录的有效标识符
                t: new Date().getTime(), // 一个时间戳，可能用于防缓存
              },
            });
          },
        },
        record.portCount
      );
    },
  },
  {
    title: '公网',
    align: 'center',
    dataIndex: 'isPublic',
    filters: [
      { text: '是', value: 'Y' },
      { text: '否', value: 'N' },
    ],
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y' },
        { text: '否', value: 'N' },
      ]);
    },
  },
  {
    title: 'ipv6',
    align: 'center',
    dataIndex: 'isIpv6',
    filters: [
      { text: '是', value: 'Y' },
      { text: '否', value: 'N' },
    ],
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y' },
        { text: '否', value: 'N' },
      ]);
    },
  },
  {
    title: '运营商',
    align: 'center',
    dataIndex: 'isp',
  },
  {
    title: '国家',
    dataIndex: 'country',
    align: 'center',
  },
  {
    title: '省份',
    align: 'center',
    dataIndex: 'province',
  },
  {
    title: '城市',
    align: 'center',
    dataIndex: 'city',
  },
  {
    title: '资产标签',
    align: 'center',
    dataIndex: 'assetLabel_dictText',
  },
  {
    title: '来源',
    align: 'center',
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
  },
  {
    label: 'ip',
    field: 'ip',
    component: 'Input',
  },
  {
    label: '子域名',
    field: 'sub_domain_id',
    component: 'JPopupDict',
    componentProps: {
      placeholder: '请选择',
      dictCode: 'select_sub_domain,sub_domain,id',
    },
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
    label: '子域名',
    field: 'subDomainIds',
    component: 'JPopupDict',
    componentProps: {
      placeholder: '请选择',
      dictCode: 'select_sub_domain,sub_domain,id',
      multi: true,
    },
  },
  {
    label: 'ip',
    field: 'ip',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '请输入ip!' },
        {
          pattern:
            '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^::([\\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:):([\\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){2}:([\\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){3}:([\\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){7}[\\da-fA-F]{1,4}$|^:((:[\\da-fA-F]{1,4}){1,6}|:)$|^[\\da-fA-F]{1,4}:((:[\\da-fA-F]{1,4}){1,5}|:)$|^([\\da-fA-F]{1,4}:){2}((:[\\da-fA-F]{1,4}){1,4}|:)$|^([\\da-fA-F]{1,4}:){3}((:[\\da-fA-F]{1,4}){1,3}|:)$|^([\\da-fA-F]{1,4}:){4}((:[\\da-fA-F]{1,4}){1,2}|:)$|^([\\da-fA-F]{1,4}:){5}:([\\da-fA-F]{1,4})?$|^([\\da-fA-F]{1,4}:){6}:$',
          message: '请输入正确的ip!',
        },
      ];
    },
  },
  {
    label: '公网',
    field: 'isPublic',
    component: 'JSwitch',
    componentProps: {},
  },
  {
    label: 'ipv6',
    field: 'isIpv6',
    component: 'JSwitch',
    componentProps: {},
  },
  {
    label: '运营商',
    field: 'isp',
    component: 'Input',
  },
  {
    label: '国家',
    field: 'country',
    component: 'Input',
  },
  {
    label: '省份',
    field: 'province',
    component: 'Input',
  },
  {
    label: '城市',
    field: 'city',
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
    label: '来源',
    field: 'source',
    defaultValue: '手工录入',
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
  projectId: { title: '项目', order: 0, view: 'sel_search', type: 'string', dictTable: 'project', dictCode: 'id', dictText: 'project_name' },
  ip: { title: 'ip', order: 1, view: 'text', type: 'string' },
  isPublic: {
    title: '公网',
    order: 2,
    view: 'list',
    type: 'string',
    enum: [
      { value: 'Y', title: '是' },
      { value: 'N', title: '否' },
    ],
  },
  isIpv6: {
    title: 'ipv6',
    order: 3,
    view: 'list',
    type: 'string',
    enum: [
      { value: 'Y', title: '是' },
      { value: 'N', title: '否' },
    ],
  },
  isp: { title: '运营商', order: 4, view: 'text', type: 'string' },
  province: { title: '省份', order: 5, view: 'text', type: 'string' },
  city: { title: '城市', order: 6, view: 'text', type: 'string' },
  source: { title: '来源', order: 8, view: 'text', type: 'string' },
  country: { title: '国家', order: 10, view: 'text', type: 'string' },
  region: { title: '地区', order: 11, view: 'text', type: 'string' },
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
