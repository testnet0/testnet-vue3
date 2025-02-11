<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { ref } from 'vue';
  import { batchChangeVulStatus } from '@/views/asset/common/Common.api';
  const emit = defineEmits(['register', 'success']);
  const postData = ref([]);
  //表单数据
  const formSchema: FormSchema[] = [
    {
      label: '漏洞状态',
      field: 'vulStatus',
      component: 'JDictSelectTag',
      componentProps: {
        dictCode: 'vul_status',
        getPopupContainer: (node) => document.body,
      },
      dynamicRules: ({ model, schema }) => {
        return [{ required: true, message: '请选择漏洞状态!' }];
      },
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

  const title = '批量调整漏洞状态';

  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      //提交表单
      await batchChangeVulStatus({ ...values, ...postData.value });
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
