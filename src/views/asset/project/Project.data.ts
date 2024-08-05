import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { render } from '@/utils/common/renderUtils';
import { router } from '@/router';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '项目名称',
    align: 'center',
    ellipsis: true,
    resizable: true,
    dataIndex: 'projectName',
    fixed: 'left',
  },
  {
    title: '项目地址',
    align: 'center',
    dataIndex: 'address',
    ellipsis: true,
    resizable: true,
    fixed: 'left',
    customRender: ({ record }) => {
      // @ts-ignore
      return h('a', { href: record.address, target: '_blank' }, record.address);
    },
  },
  {
    title: '优先级',
    dataIndex: 'level_dictText',
    fixed: 'left',
    sorter: {
      multiple: 3,
    },
    customRender: ({ text }) => {
      const color = text == '低' ? 'blue' : text == '中' ? 'yellow' : 'red';
      return render.renderTag(text, color);
    },
  },
  {
    title: '微信公众号',
    align: 'center',
    dataIndex: 'wechat',
  },
  {
    title: '邮箱',
    align: 'center',
    dataIndex: 'mail',
  },
  {
    title: '微博',
    align: 'center',
    dataIndex: 'weibo',
    customRender: ({ record }) => {
      // @ts-ignore
      return h('a', { href: record.weiboLink, target: '_blank' }, record.weibo);
    },
  },
  {
    title: '公司',
    align: 'center',
    width: 80,
    dataIndex: 'assetCompanyCount',
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            router.push({ path: '/testnet/assetCompanyList', query: { projectId: record.id, t: new Date().getTime() } });
          },
        },
        record.assetCompanyCount
      );
    },
  },
  {
    title: '主域名',
    align: 'center',
    width: 80,
    dataIndex: 'assetDomainCount',
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            router.push({ path: '/testnet/assetDomainList', query: { projectId: record.id, t: new Date().getTime() } });
          },
        },
        record.assetDomainCount
      );
    },
  },
  {
    title: '子域名',
    align: 'center',
    width: 80,
    dataIndex: 'assetSubDomainCount',
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            router.push({ path: '/testnet/assetSubDomainList', query: { projectId: record.id, t: new Date().getTime() } });
          },
        },
        record.assetSubDomainCount
      );
    },
  },
  {
    title: 'IP',
    align: 'center',
    width: 80,
    dataIndex: 'assetIPCount',
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            router.push({ path: '/testnet/assetIpList', query: { projectId: record.id, t: new Date().getTime() } });
          },
        },
        record.assetIPCount
      );
    },
  },
  {
    title: '端口',
    align: 'center',
    width: 80,
    dataIndex: 'assetPortCount',
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            router.push({ path: '/testnet/assetPortList', query: { projectId: record.id, t: new Date().getTime() } });
          },
        },
        record.assetPortCount
      );
    },
  },
  {
    title: 'web应用',
    width: 80,
    align: 'center',
    dataIndex: 'assetWebCount',
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            router.push({ path: '/testnet/assetWebList', query: { projectId: record.id, t: new Date().getTime() } });
          },
        },
        record.assetWebCount
      );
    },
  },
  {
    title: 'API',
    width: 80,
    align: 'center',
    dataIndex: 'assetApiCount',
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            router.push({ path: '/testnet/assetApiList', query: { projectId: record.id, t: new Date().getTime() } });
          },
        },
        record.assetApiCount
      );
    },
  },
  {
    title: '漏洞',
    align: 'center',
    width: 80,
    dataIndex: 'assetVulCount',
    customRender: ({ record }) => {
      return h(
        'a',
        {
          onClick: () => {
            router.push({ path: '/testnet/assetVulList', query: { projectId: record.id, t: new Date().getTime() } });
          },
        },
        record.assetVulCount
      );
    },
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
    label: '项目名称',
    field: 'projectName',
    component: 'Input',
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '项目名称',
    field: 'projectName',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入项目名称!' }];
    },
  },
  {
    label: '优先级',
    field: 'level',
    component: 'JDictSelectTag',
    defaultValue: '0',
    componentProps: {
      dictCode: 'priority',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '项目地址',
    field: 'address',
    component: 'Input',
    dynamicRules: () => {
      return [
        { required: false },
        {
          pattern: /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/,
          message: '请输入正确的网址!',
        },
      ];
    },
  },
  {
    label: '微信公众号',
    field: 'wechat',
    component: 'Input',
  },
  {
    label: '邮箱',
    field: 'mail',
    component: 'Input',
  },
  {
    label: '微博',
    field: 'weibo',
    component: 'Input',
  },
  {
    label: '微博链接',
    field: 'weiboLink',
    component: 'Input',
    dynamicRules: () => {
      return [
        { required: false },
        {
          pattern: /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/,
          message: '请输入正确的网址!',
        },
      ];
    },
  },
  {
    label: '备注',
    field: 'commnet',
    component: 'InputTextArea',
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
  projectName: { title: '项目名称', order: 0, view: 'text', type: 'string' },
  address: { title: '项目地址', order: 1, view: 'text', type: 'string' },
  level: { title: '优先级', order: 2, view: 'number', type: 'number', dictCode: 'priority' },
  wechat: { title: '微信公众号', order: 4, view: 'text', type: 'string' },
  mail: { title: '邮箱', order: 5, view: 'text', type: 'string' },
  weibo: { title: '微博', order: 6, view: 'text', type: 'string' },
  weiboLink: { title: '微博链接', order: 7, view: 'text', type: 'string' },
};
/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
