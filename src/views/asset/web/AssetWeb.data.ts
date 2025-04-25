import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {router} from '@/router';
import {Image, Tag} from 'ant-design-vue';
import {Icon} from '/@/components/Icon';
import {CURRENT_PROJECT_ID_KEY} from '../project/Project.api';

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
    title: 'IP',
    align: 'center',
    dataIndex: 'ip_dictText',
    resizable: true,
    fixed: 'left',
    customRender: ({record}) => {
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
          // 域名
          h('span', null, record.ip_dictText),
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
                    id: record.ip,
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
    },
  },
  {
    title: '子域名',
    align: 'center',
    resizable: true,
    fixed: 'left',
    dataIndex: 'domain_dictText',
    customRender: ({record}) => {
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
          // 域名
          h('span', null, record.domain_dictText),
          // 跳转按钮
          record.domain_dictText ? h(
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
                  path: '/testnet/assetSubDomainList',
                  query: {
                    id: record.domain,
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
          ) : null,
        ]
      );
    },
  },
  {
    title: '端口/协议',
    align: 'center',
    fixed: 'left',
    width: 100,
    dataIndex: 'portId_dictText',
    resizable: true,
    customRender: ({record}) => {
      return h('span', [record.portId_dictText, ' ', h(Tag, {color: record.protocol === 'http' ? 'green' : 'blue'}, () => record.httpSchema)]);
    },
  },
  {
    title: 'Icon',
    align: 'center',
    width: 50,
    dataIndex: 'iconUrl',
    customRender(opt) {
      return h(Image, {
        width: 20,
        height: 20,
        src: opt.record.iconUrl ? opt.record.iconUrl : '',
        preview: false,
        fallback:
          'data:image/png;base64,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',
      });
    },
  },
  {
    title: '站点标题',
    align: 'center',
    dataIndex: 'webTitle',
    ellipsis: true,
    resizable: true,
    width: 260,
    customRender: ({record}) => {
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
          // 域名
          h('span', null, record.webTitle?record.webTitle:'暂无标题'),
          // 跳转按钮
          h(
            'a',
            {
              type: 'link',
              size: 'small',
              style: {
                padding: '2px',
                minWidth: 'auto',
              },
              href: record.webUrl,
              target: '_blank',
              rel: 'noreferrer',
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
    },
    // customRender: ({record}) => {
    //   return h('span', [
    //     h(
    //       'a',
    //       {
    //         href: record.webUrl,
    //         target: '_blank',
    //         rel: 'noreferrer',
    //         style: 'text-decoration: none;', // 移除下划线并继承颜色
    //       },
    //       [
    //         record.webTitle ? record.webTitle : record.webUrl,
    //         h(Icon, {icon: 'ant-design:link-outlined', style: 'margin-left: 4px;'}), // 调整边距
    //       ]
    //     ),
    //   ]);
    // },
  },
  {
    title: '状态码',
    align: 'center',
    width: 80,
    dataIndex: 'statusCode',
  },
  {
    title: '应用/组件',
    align: 'center',
    dataIndex: 'tech',
    width: 200,
    resizable: true,
    customRender: ({record}) => {
      if (record.tech) {
        const components = JSON.parse(record.tech);
        // 使用Fragment包裹所有的span标签
        return h(
          'div',
          {style: {'argin-bottom': '10px'}},
          components.map((item, index) => {
            let color = 'default';
            // 根据不同的条件设置不同的颜色
            if (index % 2 === 0) {
              color = 'red';
            } else {
              color = 'blue';
            }
            const tagContent = `${item.name}${item.version ? ` (${item.version})` : ''}`;
            return h(
              Tag,
              {
                color: color,
                style: 'margin-left: 5px;margin-top: 5px;',
              },
              () => tagContent
            );
          })
        );
      } else {
        return h('span', '无数据');
      }
    },
  },
  {
    title: '站点截图',
    align: 'center',
    dataIndex: 'screenshot',
    width: 200,
    resizable: true,
    customRender: ({record}) => {
      if (!record.screenshot) {
        return h(Image, {
          width: 100,
          height: 100,
          src: '',
          fallback:
            'data:image/png;base64,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',
        });
      }
      return h(Image, {
        width: 100,
        height: 100,
        src: record.screenshot,
        fallback:
          'data:image/png;base64,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',
      });
    },
  },
  {
    title: '返回包大小',
    align: 'center',
    width: 90,
    dataIndex: 'contentLength',
  },
  {
    title: '延迟',
    align: 'center',
    dataIndex: 'delayTime',
  },
  {
    title: '服务器',
    align: 'center',
    dataIndex: 'webServer',
  },
  {
    title: 'content_type',
    align: 'center',
    dataIndex: 'contentType',
  },
  {
    title: '资产标签',
    align: 'center',
    dataIndex: 'assetLabel_dictText',
    resizable: true,
    customRender: ({record}) => {
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
                    path: '/testnet/assetWebList',
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
    label: '项目',
    field: 'projectId',
    component: 'JSearchSelect',
    componentProps: {
      dict: 'project,project_name,id',
      async: true,
    },
    defaultValue: localStorage.getItem(CURRENT_PROJECT_ID_KEY),
    //colProps: {span: 6},
  },
  {
    label: '子域名',
    field: 'subdomain',
    component: 'Input',
  },
  {
    label: 'IP',
    field: 'ip',
    component: 'Input',
  },
  {
    label: '站点标题',
    field: 'webTitle',
    component: 'Input',
    //colProps: {span: 6},
  },
  // {
  //   label: '返回包',
  //   field: 'body',
  //   component: 'Input',
  //   //colProps: {span: 6},
  // },
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
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({model, schema}) => {
      return [{required: true, message: '请输入所属项目!'}];
    },
    defaultValue: localStorage.getItem(CURRENT_PROJECT_ID_KEY),
  },
  {
    label: '子域名',
    field: 'domain',
    component: 'JPopupDict',
    componentProps: {
      placeholder: '请选择',
      dictCode: 'select_sub_domain,sub_domain,id',
    },
    ifShow: ({values}) => {
      return values.id != null;
    },
  },
  {
    label: 'IP/端口',
    field: 'portId',
    component: 'JPopupDict',
    componentProps: ({formActionType}) => {
      const {setFieldsValue} = formActionType;
      return {
        setFieldsValue,
        placeholder: '请选择',
        dictCode: 'select_port,ip_port,id',
      };
    },
    dynamicRules: ({model, schema}) => {
      return [{required: true, message: '请输入IP/端口!'}];
    },
    ifShow: ({values}) => {
      return values.id != null;
    },
  },
  {
    label: '访问链接',
    field: 'webUrl',
    component: 'InputTextArea',
    dynamicRules: ({model, schema}) => {
      return [{required: true, message: '请输入访问链接!'}];
    },
    dynamicDisabled: ({values}) => {
      return values.id != null;
    },
    componentProps: {
      allowClear: true,
      autoSize: {
        //最小显示行数
        minRows: 3,
      },
      placeholder: '可以同时输入多个，换行分割，如:\nhttps://www.xx.com\nhttp://127.0.0.1',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '站点标题',
    field: 'webTitle',
    component: 'Input',
    ifShow: ({values}) => {
      return values.id != null;
    },
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
    label: 'http协议',
    field: 'httpSchema',
    component: 'Input',
    ifShow: ({values}) => {
      return values.id != null;
    },
  },
  {
    label: 'Header',
    field: 'webHeader',
    component: 'JCodeEditor',
    componentProps: {
      language: 'application/json',
    },
    ifShow: ({values}) => {
      return values.id != null;
    },
  },
  // {
  //   label: '返回包',
  //   field: 'body',
  //   component: 'JCodeEditor',
  //   componentProps: {
  //     language: 'javascript',
  //   },
  //   ifShow: ({ values }) => {
  //     return values.id != null;
  //   },
  // },
  {
    label: '站点截图',
    field: 'screenshot',
    dynamicDisabled: true,
    component: 'JImageUpload',
    componentProps: {},
    ifShow: ({values}) => {
      return values.id != null;
    },
  },
  {
    label: 'Icon_hash',
    field: 'favicon',
    component: 'Input',
    ifShow: ({values}) => {
      return values.id != null;
    },
  },
  {
    label: '服务器',
    field: 'webServer',
    component: 'Input',
    ifShow: ({values}) => {
      return values.id != null;
    },
  },
  {
    label: 'content_type',
    field: 'contentType',
    component: 'Input',
    ifShow: ({values}) => {
      return values.id != null;
    },
  },
  {
    label: '延迟',
    field: 'delayTime',
    component: 'Input',
    ifShow: ({values}) => {
      return values.id != null;
    },
  },
  {
    label: '技术框架',
    field: 'tech',
    component: 'Input',
    ifShow: ({values}) => {
      return values.id != null;
    },
  },
  {
    label: '状态码',
    field: 'statusCode',
    component: 'InputNumber',
    ifShow: ({values}) => {
      return values.id != null;
    },
  },
  {
    label: 'bodyMd5',
    field: 'bodyMd5',
    component: 'Input',
    ifShow: ({values}) => {
      return values.id != null;
    },
  },
  {
    label: 'headerMd5',
    field: 'headerMd5',
    component: 'Input',
    ifShow: ({values}) => {
      return values.id != null;
    },
  },
  {
    label: 'content_length',
    field: 'contentLength',
    component: 'InputNumber',
    ifShow: ({values}) => {
      return values.id != null;
    },
  },
  {
    label: '来源',
    field: 'source',
    component: 'Input',
    defaultValue: '手工录入',
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
  projectId: {
    title: '所属项目',
    order: 0,
    view: 'sel_search',
    type: 'string',
    dictTable: 'project',
    dictCode: 'id',
    dictText: 'project_name',
  },
  domain: {
    title: '子域名',
    order: 1,
    view: 'sel_search',
    type: 'string',
    dictTable: 'asset_sub_domain',
    dictCode: 'id',
    dictText: 'sub_domain'
  },
  portId: {
    title: '端口',
    order: 2,
    view: 'popup',
    type: 'string',
    code: 'select_port',
    destFields: 'portId',
    orgFields: 'id',
    popupMulti: true
  },
  webTitle: {title: '站点标题', order: 3, view: 'text', type: 'string'},
  webHeader: {title: 'Header', order: 4, view: 'textarea', type: 'string'},
  favicon: {title: 'favicon', order: 5, view: 'text', type: 'string'},
  screenshot: {title: '站点截图', order: 6, view: 'image', type: 'string'},
  source: {title: '来源', order: 7, view: 'text', type: 'string'},
  webUrl: {title: '访问链接', order: 8, view: 'text', type: 'string'},
  webServer: {title: '服务器', order: 9, view: 'text', type: 'string'},
  contentType: {title: 'content_type', order: 10, view: 'text', type: 'string'},
  delayTime: {title: '延迟', order: 11, view: 'text', type: 'string'},
  tech: {title: '应用/组件', order: 12, view: 'text', type: 'string'},
  statusCode: {title: '状态码', order: 13, view: 'number', type: 'number'},
  contentLength: {title: 'content_length', order: 14, view: 'number', type: 'number'},
  httpSchema: {title: 'http协议', order: 15, view: 'text', type: 'string'},
  bodyMd5: {title: '返回包hash', order: 16, view: 'text', type: 'string'},
  headerMd5: {title: '返回头hash', order: 17, view: 'text', type: 'string'},
  jarm: {title: 'jarm指纹', order: 18, view: 'text', type: 'string'},
  createTime: {title: '创建时间', order: 19, view: 'datetime', type: 'string'},
  updateTime: {title: '更新时间', order: 20, view: 'datetime', type: 'string'},
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
