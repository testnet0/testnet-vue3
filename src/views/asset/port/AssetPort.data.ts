import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
import { router } from '@/router';
import {Tag} from "ant-design-vue";
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
    fixed: 'left',
    resizable: true,
    dataIndex: 'ip_dictText',
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            router.push({
              path: '/testnet/assetIpList',
              query: {
                id: record.ip, // 假设record.id是当前记录的有效标识符
                t: new Date().getTime(), // 一个时间戳，可能用于防缓存
              },
            });
          },
        },
        record.ip_dictText
      ); // 如果ipList不存在或者为空数组，则显示"暂无"
    },
  },
  {
    title: '端口',
    align: 'center',
    resizable: true,
    fixed: 'left',
    width: 80,
    dataIndex: 'port',
  },
  {
    title: '子域名',
    align: 'center',
    resizable: true,
    width: 300,
    dataIndex: 'assetSubDomainList',
    customRender: ({ record }) => {
      if (!record.domains || record.domains.length === 0) {
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
        record.domains.map((domainObj, index) => {
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
    title: '协议',
    align: 'center',
    dataIndex: 'protocol',
  },
  {
    title: '是否开放',
    align: 'center',
    dataIndex: 'isOpen',
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
    title: 'Web资产',
    align: 'center',
    dataIndex: 'isWeb',
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
    title: '是否TLS',
    align: 'center',
    dataIndex: 'isTls',
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
    title: '服务',
    align: 'center',
    dataIndex: 'service',
  },
  {
    title: '产品',
    align: 'center',
    dataIndex: 'product',
  },
  {
    title: '版本',
    align: 'center',
    dataIndex: 'version',
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
                    path: '/testnet/assetPortList',
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
    //colProps: {span: 6},
  },
  {
    label: 'IP',
    field: 'ips',
    component: 'Input',
  },
  {
    label: '子域名',
    field: 'subdomain',
    component: 'Input',
  },
  {
    label: '端口号',
    field: 'port',
    component: 'Input',
    //colProps: {span: 6},
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
  },
  {
    label: 'IP',
    field: 'ip',
    component: 'JSearchSelect',
    componentProps: {
      dict: 'asset_ip,ip,id',
      async: true,
    },
    dynamicDisabled: ({ values }) => {
      return values.id != null;
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择IP!' }];
    },
  },
  {
    label: '端口号',
    field: 'port',
    component: 'InputNumber',
    dynamicDisabled: ({ values }) => {
      return values.id != null;
    },
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '请输入端口号!' },
        {
          pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
          message: '请输入正确的端口号',
        },
      ];
    },
  },
  {
    label: '服务',
    field: 'service',
    component: 'Input',
  },
  {
    label: '产品',
    field: 'product',
    component: 'Input',
  },
  {
    label: '版本',
    field: 'version',
    component: 'Input',
  },
  {
    label: 'Web资产',
    field: 'isWeb',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {},
  },
  {
    label: '是否开放',
    field: 'isOpen',
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: {},
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
    component: 'Input',
    show: false,
    defaultValue: '手工录入',
  },
  {
    label: '协议',
    field: 'protocol',
    component: 'Input',
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
  port: { title: '端口号', order: 0, view: 'number', type: 'number' },
  ip: { title: '所属ip', order: 1, view: 'sel_search', type: 'string', dictTable: 'asset_ip', dictCode: 'id', dictText: 'ip' },
  product: { title: '产品', order: 2, view: 'text', type: 'string' },
  service: { title: '服务', order: 3, view: 'text', type: 'string' },
  version: { title: '版本', order: 4, view: 'text', type: 'string' },
  isWeb: { title: 'Web资产', order: 5, view: 'switch', type: 'string' },
  isOpen: { title: '是否开放', order: 6, view: 'switch', type: 'string' },
  source: { title: '来源', order: 7, view: 'list', type: 'string' },
  protocol: { title: '协议', order: 8, view: 'text', type: 'string' },
  createTime: { title: '创建时间', order: 9, view: 'datetime', type: 'string' },
  updateTime: { title: '更新时间', order: 10, view: 'datetime', type: 'string' },
  assetLabel: {
    title: '资产标签',
    order: 11,
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
