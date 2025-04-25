<template>
  <div>
    <div class="project-container">
      <div class="project-header">
        <div class="left-buttons">
          <a-button preIcon="ant-design:plus-outlined" type="primary" @click="handleAdd">新增</a-button>
          <a-button preIcon="ant-design:export-outlined" type="primary" @click="onExportXls">导出</a-button>
          <j-upload-button preIcon="ant-design:import-outlined" type="primary" @click="onImportXls">导入</j-upload-button>
        </div>
      </div>

      <div class="project-grid">
        <a-card
          v-for="item in projectList"
          :key="item.id"
          class="project-card"
          :class="{ clickable: true, 'current-project': item.id === currentProjectId }"
          :bordered="true"
          @click="handleCardClick(item)"
        >
          <div class="card-header">
            <div class="header-left">
              <div class="title-icon">
                <div class="icon-wrapper" :style="{ background: getProjectColor(item) }">
                  {{ item.projectName.substring(0, 2).toUpperCase() }}
                </div>
              </div>
              <div class="title-content">
                <h3>{{ item.projectName }}</h3>
              </div>
            </div>
            <div class="header-right">
              <a-tag :color="item.level === '0' ? 'blue' : item.level === '1' ? 'orange' : 'red'">
                {{ item.level_dictText }}
              </a-tag>
            </div>
          </div>
          <div class="card-actions">
            <a-space>
              <a-button type="link" @click.stop="handleDetail(item)">
                <Icon icon="material-symbols:info" />
                详情
              </a-button>
              <a-button type="link" @click.stop="handleEdit(item)">
                <Icon icon="material-symbols:edit" />
                编辑
              </a-button>
              <a-popconfirm title="会删除项目所有相关资产！确认删除吗？" @confirm="handleDelete(item)">
                <a-button type="link" danger @click.stop>
                  <Icon icon="material-symbols:delete" />
                  删除
                </a-button>
              </a-popconfirm>
              <a-button type="link" @click.stop="handleLink(item)" v-if="item.address">
                <Icon icon="material-symbols:link" />
                跳转
              </a-button>
            </a-space>
          </div>
        </a-card>
      </div>
      <!-- 添加分页组件 -->
      <div class="pagination-container">
        <Pagination
          showSizeChanger
          v-model:current="pagination.current"
          :page-size-options="pagination.pageSizeOptions"
          v-model:pageSize="pagination.pageSize"
          v-model:total="pagination.total"
          @change="pagination.onChange"
        />
      </div>
      <!-- 表单区域 -->
      <ProjectModal @register="registerModal" @success="handleSuccess" />
    </div>
  </div>
</template>

<script lang="ts" name="cn.iotaa-project" setup>
  import { reactive, ref, onMounted } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import ProjectModal from './components/ProjectModal.vue';
  import { columns, searchFormSchema, superQuerySchema } from './Project.data';
  import {
    CURRENT_PROJECT_ID_KEY,
    deleteOne,
    getExportUrl,
    getImportUrl,
    list,
    switchProject
  } from './Project.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { message } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { Pagination } from 'ant-design-vue';

  interface ProjectItem {
    id: string;
    projectName: string;
    status: number;
    updateTime: string;
    createTime: string;
    createBy: string;
    level: string;
    level_dictText: string;
    address: string;
    assetDomainCount: number;
    assetIPCount: number;
    assetCompanyCount: number;
    assetSubDomainCount: number;
    assetPortCount: number;
    assetWebCount: number;
    assetApiCount: number;
    assetVulCount: number;
  }
  const queryParam = reactive<any>({});
  const queryObject = reactive<any>({});

  // 成功回调
  const handleSuccess = () => {
    loadProjects();
  };


  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '项目',
      api: list,
      columns,
      canResize: false,
      showIndexColumn: true,
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
      beforeFetch: (params) => {
        Object.assign(queryObject, params);
        return Object.assign(params, queryParam);
      },
      defSort: {
        column: 'id',
        order: 'desc',
      },
    },
    exportConfig: {
      name: '项目',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const projectList = ref<ProjectItem[]>([]);
  const currentProjectId = ref<string | null>(null);
  const [registerModal, { openModal }] = useModal();
  // 添加分页相关的响应式变量
  const pagination = reactive({
    current: 1,
    pageSize: 12,
    total: 0,
    showTotal: (total: number) => `共 ${total} 条`,
    showSizeChanger: true,
    pageSizeOptions: ['12', '24', '36', '48'],
    onChange: (page: number, pageSize: number) => {
      pagination.current = page;
      pagination.pageSize = pageSize;
      loadProjects();
    },
    onShowSizeChange: (current: number, size: number) => {
      pagination.current = 1;
      pagination.pageSize = size;
      loadProjects();
    },
  });

  // 获取项目列表
  const loadProjects = async () => {
    try {
      const res = await list({
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
      });
      console.log(res);
      projectList.value = (res?.records || []).filter((item: any) => item && item.id);
      pagination.total = res?.total || 0;
    } catch (error) {
      console.error('获取项目列表失败:', error);
      message.error('获取项目列表失败');
      projectList.value = [];
      pagination.total = 0;
    }
  };

  // 获取项目卡片颜色
  const getProjectColor = (project: ProjectItem) => {
    if (!project?.id) return '#ffc069'; // 默认颜色
    const colors = ['#ffc069', '#73d13d', '#40a9ff', '#ff4d4f', '#722ed1'];
    return colors[Math.abs(hashCode(project.id)) % colors.length];
  };

  // 简单的哈希函数
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash;
    }
    return hash;
  };

  // 更新当前项目ID
  const updateCurrentProjectId = () => {
    currentProjectId.value = localStorage.getItem(CURRENT_PROJECT_ID_KEY);
  };

  // 处理卡片点击
  const handleCardClick = async (record: ProjectItem) => {
    if (currentProjectId.value === record.id) {
      // 如果点击的是当前项目，则取消选择
      localStorage.removeItem(CURRENT_PROJECT_ID_KEY);
      currentProjectId.value = null;
    } else {
      // 否则切换到新项目
      await switchProject(record.id);
    }
    location.reload();
  };

  // 新增事件
  const handleAdd = () => {
    openModal(true, {
      isUpdate: false,
      showFooter: true,
    });
  };

  // 编辑事件
  const handleEdit = (record: any) => {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  };

  // 详情事件
  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }

  // 删除事件
  const handleDelete = async (record: any) => {
    try {
      await deleteOne({ id: record.id }, () => {
        loadProjects();
      });
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 处理跳转事件
  const handleLink = (record: ProjectItem) => {
    const projectUrl = record.address;
    window.open(projectUrl, '_blank');
  };

  // 高级查询事件
  const handleSuperQuery = (params: any) => {
    loadProjects();
  };

  onMounted(() => {
    updateCurrentProjectId();
    loadProjects();
  });
</script>

<style lang="less" scoped>
  .project-container {
    padding: 24px;
    background: #f0f2f5;
    min-height: 100vh;
  }

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .left-buttons {
      display: flex;
      gap: 8px;
    }
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    margin-bottom: 24px;
    background: white;
    padding: 16px;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  }

  .project-card {
    background: #ffffff;
    border-radius: 8px;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.05),
      0 1px 2px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none !important;
    position: relative;
    overflow: hidden;

    :deep(.ant-card-body) {
      padding: 24px;
    }

    &.clickable {
      cursor: pointer;
      &:hover {
        box-shadow:
          0 8px 16px rgba(0, 0, 0, 0.08),
          0 4px 8px rgba(0, 0, 0, 0.12);
        transform: translateY(-2px);
      }
    }

    &.current-project {
      background: linear-gradient(135deg, #e6f7ff 0%, #ffffff 100%);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);

      &::before {
        content: '当前项目';
        position: absolute;
        top: 0;
        right: 0;
        background: #1890ff;
        color: white;
        padding: 4px 12px;
        font-size: 12px;
        border-radius: 0 8px 0 8px;
        z-index: 1;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;

      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;

        .title-icon {
          .icon-wrapper {
            width: 52px;
            height: 52px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            font-weight: 600;
            color: white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background-image: linear-gradient(135deg, var(--main-color) 0%, var(--light-color) 100%);
          }
        }

        .title-content {
          h3 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.88);
            line-height: 1.4;
            margin-bottom: 4px;
          }

          .asset-total {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.45);
            display: flex;
            align-items: center;
            gap: 4px;

            &::before {
              content: '';
              display: inline-block;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #1890ff;
              margin-right: 4px;
            }
          }
        }
      }

      .header-right {
        :deep(.ant-tag) {
          border: none;
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 500;
          font-size: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
        }
      }
    }

    .card-actions {
      display: flex;
      //justify-content: flex-end;
      padding-top: 16px;
      margin-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.06);

      :deep(.ant-btn-link) {
        padding: 6px 12px;
        border-radius: 6px;
        transition: all 0.3s;
        color: rgba(0, 0, 0, 0.65);
        font-weight: 500;

        &:hover {
          color: #1890ff;
          background: rgba(24, 144, 255, 0.04);
        }

        &.ant-btn-dangerous {
          &:hover {
            color: #ff4d4f;
            background: rgba(255, 77, 79, 0.04);
          }
        }

        .anticon {
          font-size: 16px;
          margin-right: 4px;
        }
      }
    }
  }

  // 获取项目卡片颜色
  :deep(.project-card) {
    --main-color: #1890ff;
    --light-color: #69c0ff;

    &:nth-child(3n + 1) {
      --main-color: #722ed1;
      --light-color: #b37feb;
    }
    &:nth-child(3n + 2) {
      --main-color: #13c2c2;
      --light-color: #5cdbd3;
    }
    &:nth-child(3n + 3) {
      --main-color: #2f54eb;
      --light-color: #85a5ff;
    }
  }
</style>
