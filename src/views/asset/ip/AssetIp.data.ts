import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
import { rules } from '/@/utils/helper/validator';
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
    width: 300,
    dataIndex: 'assetSubDomainList',
    customRender: ({ record }) => {
      if (!record.domainVOList || record.domainVOList.length === 0) {
        return '暂无';
      }
      return h(
        'div',
        {
          style: {
            maxHeight: '150px', // 限制高度
            overflowY: 'auto', // 启用纵向滚动条
            display: 'flex',
            flexDirection: 'column',
          }, // 使用flex布局，子元素自动换行
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
                    path: '/testnet/assetIpList',
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
    field: 'sub_domain',
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
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入所属项目!' }];
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
    label: '子域名',
    field: 'subDomains',
    component: 'InputTextArea',
    componentProps: {
      getPopupContainer: (node) => document.body,
    },
    ifShow: ({ values }) => {
      return values.id != null;
    },
  },
  {
    label: 'ip',
    field: 'ip',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入ip!' }];
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
      placeholder: '可以同时输入多个，换行分割，如:\n1.1.1.1\n1.1.1.1-1.1.1.10\n1.1.1.1/24',
      getPopupContainer: (node) => document.body,
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
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
