<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { assetImport } from '@/views/asset/search/AssetSearch.api';
  import { ref } from 'vue';
  const emit = defineEmits(['register', 'success']);
  const postData = ref([]);
  //表单数据
  const formSchema: FormSchema[] = [
    {
      label: '选择项目',
      field: 'projectId',
      component: 'JDictSelectTag',
      required: true,
      componentProps: {
        dictCode: 'project,project_name,id',
      },
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

  const title = '导入数据';

  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      //提交表单
      await assetImport({ projectId: values.projectId, ...postData.value });
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
