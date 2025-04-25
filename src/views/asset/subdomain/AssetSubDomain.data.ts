import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { h } from 'vue';
import { router } from '@/router';
import { createContextMenu } from '@/components/ContextMenu';
import { Tag } from 'ant-design-vue';
import { CURRENT_PROJECT_ID_KEY } from '../project/Project.api';
import Icon from '/@/components/Icon';

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
  },
  {
    title: '主域名|标签',
    align: 'center',
    resizable: true,
    dataIndex: 'domainId_dictText',
    customRender: ({ record }) => {
      const labels = record.domainLabel_dictText ? record.domainLabel_dictText.split(',') : [];
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
          record.domainId_dictText || '',
          // 跳转图标按钮
          h(
            'a-button',
            {
              type: 'link',
              size: 'small',
              style: {
                padding: '4px',
              },
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
            [
              h(Icon, {
                icon: 'material-symbols:link',
                style: {
                  fontSize: '16px',
                  color: '#1890ff',
                },
              }),
            ]
          ),
          ...(labels.length > 0
            ? [
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
              ]
            : []),
        ]
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
    title: '解析IP(开放端口数)',
    align: 'center',
    width: 200,
    dataIndex: 'ip',
    resizable: true,
    customRender: ({ record }) => {
      if (!record.ipList || record.ipList.length === 0) {
        return '暂无';
      }
      return h(
        'div',
        {
          style: {
            maxHeight: '150px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          },
        },
        record.ipList.map((ipObj) => {
          return h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              },
            },
            [
              // IP和端口数量
              h('span', null, `${ipObj.ip}(${ipObj.portCount})`),
              // 跳转按钮
              h(
                'a-button',
                {
                  type: 'link',
                  size: 'small',
                  style: {
                    padding: '2px',
                    minWidth: 'auto',
                  },
                  onClick: () => {
                    router.push({
                      path: '/testnet/assetIpList',
                      query: {
                        id: ipObj.id,
                        t: new Date().getTime(),
                      },
                    });
                  },
                },
                [
                  h(Icon, {
                    icon: 'material-symbols:link',
                    style: {
                      fontSize: '14px',
                      color: '#1890ff',
                    },
                  }),
                ]
              ),
            ]
          );
        })
      );
    },
  },
  {
    title: 'Web站点/状态码',
    align: 'center',
    dataIndex: 'web',
    resizable: true,
    customRender: ({ record }) => {
      if (!record.assetWebVOList || record.assetWebVOList.length === 0) {
        return '暂无';
      }
      return h(
        'div', // 创建一个容器div来包裹所有的a标签
        {
          style: {
            maxHeight: '150px', // 限制高度
            overflowY: 'auto', // 启用纵向滚动条
            display: 'flex',
            flexDirection: 'column',
          }, // 使用flex布局，子元素自动换行
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
                    path: '/testnet/assetSubDomainList',
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
    width: 100,
    ellipsis: true,
    dataIndex: 'source',
  },
  {
    title: '负责人',
    align: 'center',
    resizable: true,
    dataIndex: 'assetManager_dictText',
  },
  {
    title: '负责部门',
    align: 'center',
    resizable: true,
    dataIndex: 'assetDepartment_dictText',
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
    label: '所属项目',
    field: 'projectId',
    component: 'JSearchSelect',
    componentProps: {
      dict: 'project,project_name,id',
      async: true,
    },
    defaultValue: localStorage.getItem(CURRENT_PROJECT_ID_KEY),
  },
  {
    label: '主域名',
    field: 'domain',
    component: 'Input',
  },
  {
    label: '子域名',
    field: 'subDomain',
    component: 'Input',
    //colProps: {span: 6},
  },
  {
    label: 'IP',
    field: 'ip',
    component: 'Input',
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
    defaultValue: localStorage.getItem(CURRENT_PROJECT_ID_KEY),
  },
  {
    label: '主域名',
    field: 'domainId',
    component: 'JSearchSelect',
    componentProps: {
      placeholder: '请选择',
      dict: 'asset_domain,domain,id',
      async: true,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择主域名!' }];
    },
    ifShow: ({ values }) => {
      return values.domain != null;
    },
  },
  {
    label: '子域名',
    field: 'subDomain',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入子域名!' }];
    },
    componentProps: {
      allowClear: true,
      autoSize: {
        //最小显示行数
        minRows: 3,
      },
      placeholder: '支持多行输入,每行一个值,例如：\na.xxx.com\na.xxx.cn',
      getPopupContainer: (node) => document.body,
    },
    dynamicDisabled: ({ values }) => {
      return values.id != null;
    },
  },
  {
    label: '解析IP',
    field: 'ips',
    component: 'InputTextArea',
    componentProps: {
      getPopupContainer: (node) => document.body,
    },
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
    label: '负责人',
    field: 'assetManager',
    component: 'JSelectUser',
  },
  {
    label: '负责部门',
    field: 'assetDepartment',
    component: 'JSelectDept',
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
  type: { title: '解析类型', order: 3, view: 'list', type: 'string', dictCode: 'dns_type' },
  dnsRecord: { title: '解析值', order: 4, view: 'text', type: 'string' },
  nameServer: { title: 'name_server', order: 5, view: 'text', type: 'string' },
  level: { title: '域名等级', order: 7, view: 'number', type: 'number' },
  source: { title: '来源', order: 10, view: 'text', type: 'string' },
  createTime: { title: '创建时间', order: 12, view: 'datetime', type: 'string' },
  updateTime: { title: '更新时间', order: 13, view: 'datetime', type: 'string' },
  assetLabel: {
    title: '资产标签',
    order: 14,
    view: 'sel_search',
    type: 'string',
    dictTable: 'asset_label',
    dictCode: 'id',
    dictText: 'label_name',
  },
  assetManager: {
    title: '负责人',
    order: 15,
    view: 'sel_user',
    type: 'string',
  },
  assetDepartment: {
    title: '负责部门',
    order: 16,
    view: 'sel_depart',
    type: 'string',
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
