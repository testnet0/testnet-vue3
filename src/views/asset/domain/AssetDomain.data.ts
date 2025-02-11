import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
import { router } from '@/router';
import {createContextMenu} from "@/components/ContextMenu";
import {Tag} from "ant-design-vue";

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
              keyword: `domain.suffix="${record.domain}"`,
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
              keyword: `domain="${record.domain}"`,
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
              keyword: `domain:"*.${record.domain}"`,
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
              keyword: `hostname:"${record.domain}"`,
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
    fixed: 'left',
    ellipsis: true,
    resizable: true,
    dataIndex: 'domain',
    customRender: ({ record }) => {
      return h('a-button', { onContextmenu: (e: MouseEvent) => handleContext(e, record) }, record.domain ? record.domain : '');
    },
  },
  {
    title: '子域名数量',
    align: 'center',
    ellipsis: true,
    resizable: true,
    dataIndex: 'subDomainNumber',
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            router.push({
              path: '/testnet/assetSubDomainList',
              query: { domainId: record.id, t: new Date().getTime() },
            });
          },
        },
        record.subDomainNumber
      );
    },
  },
  {
    title: 'ICP备案号',
    align: 'center',
    ellipsis: true,
    resizable: true,
    dataIndex: 'icpNumber',
  },
  {
    title: 'whois',
    align: 'center',
    dataIndex: 'whois',
  },
  {
    title: 'dns服务器',
    align: 'center',
    dataIndex: 'dnsServer',
  },
  {
    title: '所属公司|标签',
    align: 'center',
    resizable: true,
    dataIndex: 'companyId_dictText',
    customRender: ({ record }) => {
  // record.companyId_dictText 和 record.assetCompanyLabel_dictText 拼接
  const labels = record.assetCompanyLabel_dictText ? record.assetCompanyLabel_dictText.split(',') : [];
  const colors = [
    '#ffb74d', // 中等橙色
    '#81c784', // 中等绿色
    '#7986cb', // 中等蓝色
    '#f06292', // 中等粉色
    '#ff8a65', // 中等红色
    '#aed581', // 亮绿色
    '#64b5f6', // 亮蓝色
    '#fff176', // 亮黄色
    '#ba68c8', // 中等紫色
    '#ffb300', // 中等金色
    '#dce775', // 柔和黄绿色
  ];

  const handleClick = () => {
    router.push({
      path: '/testnet/assetCompanyList',
      query: {
        id: record.companyId ? record.companyId : '',
        t: new Date().getTime(),
      },
    });
  };

  return h(
    'div',
    {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px', // 标签之间间距
        justifyContent: 'center', // 标签居中
      },
    },
    [
      h(
        'a',
        {
          style: {
            marginRight: labels.length > 0 ? '6px' : '0', // 名称和标签之间的间距
            cursor: 'pointer', // 鼠标指针样式
          },
          onClick: handleClick,
        },
        record.companyId_dictText // 显示名称
      ),
      ...(labels.length > 0 ? [
        h(
          'span',
          {
            style: {
              marginRight: '6px', // 分隔符和标签之间的间距
            },
          },
          '|' // 分隔符
        ),
        ...labels.map((item, index) => {
          const backgroundColor = colors[index % colors.length];
          return h(
            Tag,
            {
              color: backgroundColor,
              style: {
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)', // 更轻微的阴影
                transition: 'all 0.3s ease', // 平滑过渡
                cursor: 'pointer',
              },
            },
            () => item
          );
        }),
      ] : []),
    ]
  );
},



  },
  {
    title: '资产标签',
    align: 'center',
    dataIndex: 'assetLabel_dictText',
    resizable: true,
    customRender: ({ record }) => {
      if (record.assetLabel_dictText) {
        return h(
          'div',
          {
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px', // 标签之间间距
              justifyContent: 'center', // 标签居中
            },
          },
          record.assetLabel_dictText.split(',').map((item, index) => {
            const colors = [
              '#ffb74d', // 中等橙色
              '#81c784', // 中等绿色
              '#7986cb', // 中等蓝色
              '#f06292', // 中等粉色
              '#ff8a65', // 中等红色
              '#aed581', // 亮绿色
              '#64b5f6', // 亮蓝色
              '#fff176', // 亮黄色
              '#ba68c8', // 中等紫色
              '#ffb300', // 中等金色
              '#dce775', // 柔和黄绿色
            ];
            // 根据索引轮流使用颜色数组中的颜色
            const backgroundColor = colors[index % colors.length];

            return h(
              Tag,
              {
                color: backgroundColor,
                style: {
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)', // 更轻微的阴影
                  transition: 'all 0.3s ease', // 平滑过渡
                  cursor: 'pointer',
                },
                onClick: () => {
                  router.push({
                    path: '/testnet/assetDomainList',
                    query: {
                      assetLabel: record.assetLabel.split(',')[index],
                      t: new Date().getTime(),
                    },
                  });
                },
              },
              () => item
            );
          })
        );
      }
    },
  },
  {
    title: '来源',
    align: 'center',
    resizable: true,
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
    // colProps: { span: 6 },
  },
  {
    label: '主域名',
    field: 'domain',
    component: 'Input',
    // colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '项目',
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
    field: 'domain',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入主域名!' }];
    },
    dynamicDisabled: ({ values }) => {
      return values.id != null;
    },
    componentProps: {
      allowClear: true,
      autoSize: {
        //最小显示行数
        minRows: 3,
      },
      placeholder: '可以同时输入多个，换行分割，如:\nxxx.com\nxxx.cn',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '公司',
    field: 'companyId',
    component: 'JSearchSelect',
    componentProps: {
      async: true,
      dict: 'asset_company,company_name,id',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: 'ICP备案号',
    field: 'icpNumber',
    component: 'Input',
  },
  {
    label: 'dns服务器',
    field: 'dnsServer',
    component: 'Input',
  },
  {
    label: 'whois',
    field: 'whois',
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
  companyId: {
    title: '所属公司',
    order: 1,
    view: 'list',
    type: 'string',
    dictTable: 'asset_company',
    dictCode: 'id',
    dictText: 'company_name',
  },
  domain: { title: '主域名', order: 2, view: 'text', type: 'string' },
  icpNumber: { title: 'ICP备案号', order: 3, view: 'text', type: 'string' },
  whois: { title: 'whois', order: 4, view: 'text', type: 'string' },
  source: { title: '来源', order: 5, view: 'text', type: 'string' },
  dnsServer: { title: 'DNS服务器', order: 6, view: 'text', type: 'string' },
  createTime: { title: '创建时间', order: 7, view: 'datetime', type: 'string' },
  updateTime: { title: '更新时间', order: 8, view: 'datetime', type: 'string' },
  assetLabel: {
    title: '资产标签',
    order: 9,
    view: 'list',
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
