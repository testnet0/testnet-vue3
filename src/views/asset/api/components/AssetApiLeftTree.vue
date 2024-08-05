<template>
  <a-card :bordered="false" style="height: 100%; display: flex; flex-direction: column; position: relative">
    <div class="j-table-operator" style="width: 100%">
      <template v-if="checkedKeys.length > 0">
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="onDeleteBatch">
                <icon icon="ant-design:delete-outlined" />
                <span>删除</span>
              </a-menu-item>
            </a-menu>
          </template>
          <a-button>
            <span>批量操作 </span>
            <icon icon="akar-icons:chevron-down" />
          </a-button>
        </a-dropdown>
      </template>
    </div>
    <a-alert v-if="checkedKeys.length > 0" type="info" show-icon class="alert" style="margin-bottom: 8px">
      <template #message>
        <template v-if="checkedKeys.length > 0">
          <span>已选中 {{ checkedKeys.length }} 条记录</span>
          <a-divider type="vertical" />
          <a @click="checkedKeys = []">清空</a>
        </template>
      </template>
    </a-alert>
    <a-spin :spinning="loading" style="flex-grow: 1; overflow: auto">
      <a-row gutter="{16}" style="margin-bottom: 16px">
        <JSearchSelect
          placeholder="选择Web"
          :async="true"
          dict="asset_api_tree where pid = '0',absolute_path,id"
          pidValue="0"
          @select="onSelectWeb"
          @change="onChange"
          style="width: 100%"
        />
      </a-row>
      <a-row gutter="{16}" style="margin-bottom: 16px">
        <a-input-search placeholder="URL关键字" @search="onSearch" allowClear style="width: 100%" />
      </a-row>
      <template v-if="treeData.length > 0">
        <a-tree
          v-if="!treeReloading"
          showLine
          checkable
          :clickRowToExpand="true"
          :treeData="treeData"
          :selectedKeys="selectedKeys"
          :load-data="loadChildrenTreeData"
          v-model:expandedKeys="expandedKeys"
          @check="onCheck"
          @select="onSelect"
        />
      </template>
      <a-empty v-else description="暂无数据" />
    </a-spin>
    <div v-if="treeData.length > 0" class="pagination-container">
      <a-pagination :pageSize="pageSize" v-model:current="current" :showSizeChanger="false" :total="total" @change="onPageChange" />
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { inject, nextTick, ref } from 'vue';
  import { queryRootTreeSync, queryChildTreeSync, batchDeleteApiTree } from '../AssetApi.api';
  import { Pagination } from 'ant-design-vue';
  import JSearchSelect from '@/components/Form/src/jeecg/components/JSearchSelect.vue';
  import { useMessage } from '@/hooks/web/useMessage';

  const APagination = Pagination;
  const prefixCls = inject('prefixCls');
  const loading = ref<boolean>(false);
  // 部门树列表数据
  const treeData = ref<any[]>([]);
  const total = ref<number>(0);
  const current = ref<number>(1);
  const pageSize = ref<number>(10);
  // 当前展开的项
  const expandedKeys = ref<any[]>([]);
  // 当前选中的项
  const checkedKeys = ref<any[]>([]);
  // 当前选中的项
  const selectedKeys = ref<any[]>([]);
  // 树组件重新加载
  const treeReloading = ref<boolean>(false);
  // 当前选中的部门
  const currentDepart = ref<any>(null);
  // 搜索关键字
  const searchKeyword = ref('');
  // 搜索WebUrl
  const webId = ref('');

  const { createMessage, notification } = useMessage();

  const emit = defineEmits(['select', 'rootTreeData', 'load-right-data']);

  async function loadRootTreeData() {
    try {
      loading.value = true;
      treeData.value = [];
      const result = await queryRootTreeSync({ id: webId.value, keyword: searchKeyword.value });
      treeData.value = result.records.map((item) => {
        return {
          key: item.id,
          title: item.name,
          isLeaf: item.leaf,
          children: [],
          ...item,
        };
      });
      pageSize.value = result.size;
      total.value = result.total;
      current.value = result.current;
    } finally {
      loading.value = false;
    }
  }

  loadRootTreeData();

  async function onPageChange(r) {
    loading.value = true;
    let result = await queryRootTreeSync({ pageNo: r });
    treeData.value = result.records.map((item) => {
      return {
        key: item.id,
        title: item.name,
        isLeaf: item.leaf,
        children: [],
        ...item,
      };
    });
    total.value = result.total;
    current.value = r;
    loading.value = false;
  }

  // 树复选框选择事件
  function onCheck(e) {
    if (Array.isArray(e)) {
      checkedKeys.value = e;
    } else {
      checkedKeys.value = e.checked;
    }
  }

  // 加载子级
  async function loadChildrenTreeData(treeNode) {
    try {
      const result = await queryChildTreeSync({
        pid: treeNode.dataRef.key,
      });
      if (result.length == 0) {
        treeNode.dataRef.isLeaf = true;
      } else {
        treeNode.dataRef.children = result;
        if (expandedKeys.value.length > 0) {
          // 判断获取的子级是否有当前展开的项
          let subKeys: any[] = [];
          for (let key of expandedKeys.value) {
            if (result.findIndex((item) => item.id === key) !== -1) {
              subKeys.push(key);
            }
          }
          if (subKeys.length > 0) {
            expandedKeys.value = [...expandedKeys.value];
          }
        }
      }
      treeData.value = [...treeData.value];
      // await reloadTree();
    } catch (e) {
      console.error(e);
    }
    return Promise.resolve();
  }

  // 重新加载树组件，防止无法默认展开数据
  async function reloadTree() {
    await nextTick();
    treeReloading.value = true;
    checkedKeys.value = [];
    emit('select', '');
    await loadRootTreeData();
    await nextTick();
    treeReloading.value = false;
  }

  /**
   * 设置当前选中的行
   */
  function setSelectedKey(key: string, data?: object) {
    selectedKeys.value = [key];
    if (data) {
      currentDepart.value = data;
      emit('select', data);
    }
  }

  async function onSelectWeb(value) {
    if (value) {
      webId.value = value.key;
      await onSearch('');
    }
  }
  async function onChange(selectedValue) {
    if (!selectedValue) {
      webId.value = '';
    }
  }

  // 搜索事件
  async function onSearch(value: string) {
    if (webId.value == '' && value && value.length < 2) {
      // 如果不符合要求，可以在这里处理，比如提示用户
      createMessage.warning('请输入至少2个字符');
      return;
    }
    try {
      searchKeyword.value = value;
      loading.value = true;
      treeData.value = [];
      expandedKeys.value = [];
      let result = await queryRootTreeSync({ keyword: searchKeyword.value, id: webId.value });
      treeData.value = result.records.map((item) => {
        return {
          key: item.id,
          title: item.name,
          isLeaf: item.leaf,
          children: [],
          ...item,
        };
      });
      total.value = result.total;
      current.value = result.current;
    } finally {
      loading.value = false;
    }
  }

  // 树选择事件
  function onSelect(selKeys, event) {
    if (selKeys.length > 0 && selectedKeys.value[0] !== selKeys[0]) {
      setSelectedKey(selKeys[0], event.selectedNodes[0]);
    } else {
      // 这样可以防止用户取消选择
      setSelectedKey(selectedKeys.value[0]);
    }
  }

  // 批量删除
  async function onDeleteBatch() {
    try {
      batchDeleteApiTree({ ids: checkedKeys.value }, reloadTree);
    } finally {
    }
  }

  defineExpose({
    loadRootTreeData,
  });
</script>

<style scoped>
  .pagination-container {
    margin-top: 18px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
