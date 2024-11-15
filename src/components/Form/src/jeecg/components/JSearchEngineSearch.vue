<template>
  <div class="search-container">
    <AutoComplete
      v-bind="getBindValue"
      v-model:value="searchValue"
      :options="formattedOptions"
      @select="handleSelect"
      @search="customHandleSearch"
      placeholder="请输入查询语法"
    >
      <template #option="item">
        <template v-if="item.options">
          <span>
            {{ item.value }}
          </span>
          <div class="option-separator"></div>
        </template>
        <template v-else>
          <!-- 单项显示 -->
          <div class="single-item">
            <div class="single-item-content">
              <span class="single-item-value">{{ item.value }}</span>
            </div>
            <div class="single-item-content">
              <span class="single-item-description">
                {{ item.remark || '' }}
                {{ item.example ? '| 参考: ' + item.example : '' }}
              </span>
            </div>
          </div>
        </template>
      </template>
    </AutoComplete>
    <a-button type="primary" @click="customHandleMark(searchValue)" class="search-button"> 收藏</a-button>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { AutoComplete } from 'ant-design-vue';
  import { omit } from 'lodash-es';
  import { useAttrs } from '@/hooks/core/useAttrs';
  import { collectKeyword, searchAutoComplete } from '@/views/asset/search_keyword/SearchEngineKeyword.api';

  // Props
  const props = defineProps({
    engine: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    handleSearch: {
      type: Function, // 接收外部自定义的搜索逻辑
      required: true,
      default: null,
    },
    handleMark: {
      type: Function, // 接收外部自定义的收藏逻辑
      required: true,
      default: null,
    },
  });

  const searchValue = ref('');
  const formattedOptions = ref([]); // 存储搜索结果
  const attrs = useAttrs();

  // 绑定传入的其他属性
  const getBindValue = computed(() => {
    return omit(Object.assign({}, props, attrs), ['value']);
  });

  // 格式化 options
  const formatOptions = (data) => {
    return data.map((category) => ({
      value: category.type,
      options: category.keywordList.map((keyword) => ({
        value: keyword.keyword,
        example: keyword.example,
        remark: keyword.remark,
      })),
    }));
  };

  // 更新外部传入的 value
  watch(
    () => props.value,
    (newValue) => {
      searchValue.value = newValue;
    },
    { immediate: true }
  );

  // 处理选择事件
  function handleSelect(selectedValue: string) {
    console.log('Selected:', selectedValue);
  }

  // 自定义搜索函数
  async function customHandleSearch(keyword: string) {
    if (props.handleSearch) {
      // 调用外部传入的 handleSearch，并更新 options
      const newOptions = await props.handleSearch(keyword);
      if (newOptions) {
        formattedOptions.value = formatOptions(newOptions); // 更新 options
      }
    }
  }

  // 自定义搜索函数
  async function customHandleMark(keyword: string) {
    if (props.handleMark) {
      await props.handleMark(keyword);
    }
  }

  // 初始化 formattedOptions
  formattedOptions.value = formatOptions(props.options);
</script>

<style scoped>
  .search-container {
    display: flex;
    align-items: center;
  }

  .search-container .ant-select {
    flex-grow: 1; /* 让 AutoComplete 占据剩余空间 */
  }

  .search-button {
    margin-left: 10px; /* 给按钮添加一些左边距 */
  }

  .single-item {
    padding: 8px;
    font-size: 13px;
  }

  .single-item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .option-value,
  .single-item-value {
    font-weight: 500;
  }

  .option-description,
  .single-item-description {
    font-size: 12px;
    color: #999;
  }

  .option-separator,
  .single-item-separator {
    margin: 4px 0;
    border-top: 1px solid #e8e8e8;
  }
</style>
