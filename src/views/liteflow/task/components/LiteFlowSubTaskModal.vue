<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts';
  import { formSchema, liteFlowSubTaskJVxeColumns } from '../LiteFlowTask.data';
  import { saveOrUpdate, queryLiteFlowSubTask } from '../LiteFlowTask.api';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const formDisabled = ref(false);
  const refKeys = ref(['liteFlowSubTask']);
  const activeKey = ref('liteFlowSubTask');
  const liteFlowSubTask = ref();
  const tableRefs = { liteFlowSubTask };

  //表单数据
  const formSchema: FormSchema[] = [
    {
      label: '执行节点',
      field: 'clientId',
      component: 'JDictSelectTag',
      componentProps: {
        dictCode: 'client,client_name,id',
      },
      dynamicDisabled: true,
    },
    {
      label: '任务状态',
      field: 'taskStatus',
      component: 'JDictSelectTag',
      componentProps: {
        dictCode: 'plugin_status',
      },
      dynamicDisabled: true,
    },
    {
      label: '配置',
      field: 'config',
      component: 'InputTextArea',
      dynamicDisabled: true,
      componentProps: {
        rows: 4,
      },
    },
    {
      label: '参数',
      field: 'subTaskParam',
      component: 'InputTextArea',
      dynamicDisabled: true,
      componentProps: {
        rows: 4,
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
    setModalProps({ confirmLoading: false, showCancelBtn: data?.showFooter, showOkBtn: data?.showFooter });
    isUpdate.value = !!data?.isUpdate;
    formDisabled.value = !data?.showFooter;
    if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });
  //方法配置
  const [handleChangeTabs, handleSubmit, requestSubTableData, formRef] = useJvxeMethod(classifyIntoFormData, tableRefs, activeKey, refKeys);

  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : !unref(formDisabled) ? '编辑' : '详情'));

  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    return {
      ...main, // 展开
      liteFlowSubTaskList: allValues.tablesValue[0].tableData,
    };
  }
</script>

<style lang="less" scoped>
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
</style>
