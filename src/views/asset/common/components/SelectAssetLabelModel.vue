<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { ref } from 'vue';
  import { batchAddLabelBySearch } from '@/views/asset/common/Common.api';
  const emit = defineEmits(['register', 'success']);
  const postData = ref([]);
  //表单数据
  const formSchema: FormSchema[] = [
    {
      label: '操作',
      field: 'type',
      component: 'Select',
      required: true,
      componentProps: {
        options: [
          { value: 'add', label: '添加标签' },
          { value: 'update', label: '替换标签' },
          { value: 'remove', label: '删除标签' },
          { value: 'clear', label: '清空标签' },
        ],
      },
    },
    {
      label: '选择标签',
      field: 'labelIds',
      component: 'JSelectMultiple',
      required: true,
      componentProps: {
        dictCode: 'asset_label,label_name,id',
        getPopupContainer: (node) => document.body,
      },
      ifShow: ({ values }) => values.type !== 'clear',
    },
    {
      label: '数据',
      field: 'data',
      component: 'Input',
      show: false,
    },
  ];
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    postData.value = data;
    setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: true });
  });

  const title = '批量调整资产标签';

  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      //提交表单
      await batchAddLabelBySearch({ ...values, ...postData.value });
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
