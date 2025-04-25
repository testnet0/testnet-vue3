<template>
  <div class="dag-container">
    <div ref="container" class="x6-graph"></div>
    <div class="save-button" @click="saveDag">
      <span>保存</span>
    </div>
    <!-- 缩放控制按钮 -->
    <div class="zoom-controls">
      <div class="zoom-btn" @click="zoomIn">
        <span>+</span>
      </div>
      <div class="zoom-text">{{ Math.round(zoomLevel * 100) }}%</div>
      <div class="zoom-btn" @click="zoomOut">
        <span>-</span>
      </div>
      <div class="zoom-btn zoom-reset" @click="resetZoom">
        <span>重置</span>
      </div>
    </div>
    <!-- 菜单 -->
    <div v-if="showContextMenu" class="context-menu" :style="contextMenuStyle">
      <template v-if="isStartNodeSelected">
        <div v-for="option in assetTypeOptions" :key="option.value" class="context-menu-item" @click="selectAssetType(option.value)">
          <span>{{ option.label }}</span>
        </div>
      </template>
      <template v-else-if="selectedCell">
        <div v-for="option in assetTypeOptions" :key="option.value" class="context-menu-item" @click="selectAssetType(option.value)">
          <span>{{ option.label }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  import { Graph, Edge, Node } from '@antv/x6';
  import { register } from '@antv/x6-vue-shape';
  import DynamicNode from './nodes/DynamicNode.vue';
  import type { NodeConfig } from './types';
  import { mockNodes } from './mock';
  import { AssetType } from './types';
  import { useRoute } from 'vue-router';
  import { getNodeList, saveWorkflow, queryScriptNodes, convertApiNodesToNodeConfig } from './DagGraph.api';

  // 获取路由参数
  const route = useRoute();
  const workflowId = ref(route.query.id);

  // 节点数据
  const nodeList = ref<NodeConfig[]>([]);

  // 获取节点数据
  const fetchNodeData = async () => {
    try {
      // 先获取所有支持的脚本节点
      const scriptNodesRes = await queryScriptNodes();
      if (scriptNodesRes) {
        // 将API返回的节点数据转换为NodeConfig格式
        const scriptNodes = convertApiNodesToNodeConfig(scriptNodesRes);

        // 如果有工作流ID，尝试获取工作流数据
        if (workflowId.value) {
          try {
            const workflowRes = await getNodeList({ workflowId: workflowId.value });
            if (workflowRes && workflowRes.length > 0) {
              // 合并工作流节点和脚本节点
              nodeList.value = [...workflowRes, ...scriptNodes];
            } else {
              nodeList.value = scriptNodes;
            }
          } catch (error) {
            console.error('获取工作流数据失败:', error);
            nodeList.value = scriptNodes;
          }
        } else {
          nodeList.value = scriptNodes;
        }
      } else {
        // 如果获取脚本节点失败，使用mock数据
        alert('获取脚本节点失败，请检查网络连接！');
        nodeList.value = mockNodes;
      }
    } catch (error) {
      console.error('获取节点数据失败:', error);
      nodeList.value = mockNodes;
    }
  };

  // 监听workflowId变化
  watch(
    () => workflowId.value,
    () => {
      fetchNodeData();
    },
    { immediate: true }
  );

  // 注册动态节点
  register({
    shape: 'dynamic-node',
    component: DynamicNode,
    width: 200,
    height: 40,
    ports: {
      groups: {
        in: {
          position: {
            name: 'left',
          },
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#C2C8D5',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
        },
        out: {
          position: {
            name: 'right',
          },
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#C2C8D5',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
        },
      },
    },
  });

  const container = ref<HTMLElement | null>(null);
  let graph: Graph | null = null;

  // 右键菜单状态
  const showContextMenu = ref(false);
  const contextMenuPosition = ref({ x: 0, y: 0 });
  const selectedCell = ref<Node | Edge | null>(null);

  // 右键菜单样式
  const contextMenuStyle = computed(() => ({
    left: `${contextMenuPosition.value.x}px`,
    top: `${contextMenuPosition.value.y}px`,
  }));

  // 判断是否选中了开始节点
  const isStartNodeSelected = computed(() => {
    if (!selectedCell.value || !(selectedCell.value instanceof Node)) return false;
    const nodeData = selectedCell.value.getData()?.config;
    return nodeData?.type === 'start';
  });

  // 资产类型选项
  interface AssetTypeOption {
    label: string;
    value: string | AssetType;
    mockNode?: NodeConfig;
  }

  // 添加常量定义
  const nodeSpacing = 80;
  const verticalGap = 100;
  const horizontalGap = 300;

  // 添加资产类型中文映射
  const assetTypeNameMap = {
    [AssetType.Company]: '公司',
    [AssetType.Domain]: '域名',
    [AssetType.Subdomain]: '子域名',
    [AssetType.IP]: 'IP地址',
    [AssetType.Web]: '网站',
    [AssetType.Port]: '端口',
    [AssetType.API]: 'API接口',
    [AssetType.Vul]: '漏洞',
  };

  // 获取资产类型的中文名称
  const getAssetTypeName = (type: string | AssetType) => {
    return assetTypeNameMap[type as AssetType] || type;
  };

  const assetTypeOptions = computed<AssetTypeOption[]>(() => {
    if (!selectedCell.value || !(selectedCell.value instanceof Node)) return [];

    const nodeData = selectedCell.value.getData()?.config;

    if (nodeData?.type === 'start') {
      return [
        { label: '公司', value: AssetType.Company },
        { label: '域名', value: AssetType.Domain },
        { label: '子域名', value: AssetType.Subdomain },
        { label: 'IP地址', value: AssetType.IP },
        { label: '网站', value: AssetType.Web },
        { label: '端口', value: AssetType.Port },
        { label: 'API接口', value: AssetType.API },
        { label: '漏洞', value: AssetType.Vul },
      ];
    }

    // 获取当前节点的输出类型
    const outputType = nodeData?.outputs?.[0]?.type;
    if (!outputType) return [];

    if (nodeData?.type !== 'asset') {
      return [
        {
          label: '删除',
          value: 'delete',
        },
      ];
    }
    // 检查是否是开始节点创建的第一个资产节点
    const parentEdges = graph.getConnectedEdges(selectedCell.value, { incoming: true });
    const isParentStartNode = parentEdges.some((parentEdge) => {
      const parentCell = parentEdge.getSourceCell() as Node;
      return parentCell.getData()?.config?.type === 'start';
    });
    // 从节点列表中查找输入类型匹配当前节点输出类型的节点
    const availableNodes = nodeList.value.filter((node) => {
      // 如果是开始节点或结束节点，跳过
      if (node.type === 'start' || node.type === 'end') return false;

      // 获取节点的输入类型
      const nodeInputType = node.inputs?.[0]?.type;
      if (!nodeInputType) return false;

      // 如果输入类型是数组，检查是否包含当前节点的输出类型
      if (Array.isArray(nodeInputType)) {
        // 如果输出类型也是数组，检查是否有交集
        if (Array.isArray(outputType)) {
          return outputType.some((outType) => nodeInputType.includes(outType));
        }
        // 如果输出类型是单个值，检查是否在输入类型数组中
        return nodeInputType.includes(outputType);
      }

      // 如果输入类型是单个值，检查是否与输出类型匹配
      if (Array.isArray(outputType)) {
        return outputType.includes(nodeInputType);
      }

      // 都是单个值，直接比较
      return nodeInputType === outputType;
    });

    if (isParentStartNode) {
      availableNodes.push({ name: '删除', id: 'delete' });
    }
    console.log('可用节点:', availableNodes);

    // 为每个节点添加唯一标识，确保可以正确区分
    return availableNodes.map((node) => ({
      label: node.name,
      value: node.id,
      mockNode: node,
    }));
  });

  // 修改 createEdge 函数的类型定义
  const createEdge = (source: Node<Node.Properties>, target: Node<Node.Properties>) => {
    if (!graph) return null;

    return graph.createEdge({
      source: {
        cell: source.id,
        port: 'out-0',
      },
      target: {
        cell: target.id,
        port: 'in-0',
      },
      attrs: {
        line: {
          stroke: '#A2B1C3',
          strokeWidth: 2,
          targetMarker: {
            name: 'block',
            width: 12,
            height: 8,
          },
        },
      },
      router: {
        name: 'manhattan',
        args: {
          padding: 10,
          startDirections: ['right'],
          endDirections: ['left'],
        },
      },
      connector: {
        name: 'rounded',
        args: {
          radius: 8,
        },
      },
    });
  };

  // 修改 selectAssetType 函数中的节点创建部分
  const selectAssetType = (value: string | AssetType) => {
    // 如果选择的是删除选项
    if (value === 'delete') {
      deleteSelected();
      showContextMenu.value = false;
      return;
    }
    if (!selectedCell.value || !(selectedCell.value instanceof Node) || !graph) return;

    const nodeData = selectedCell.value.getData();
    if (!nodeData?.config) return;
    const startNodeBBox = selectedCell.value.getBBox();
    let maxY = startNodeBBox.y;
    const edges = graph.getConnectedEdges(selectedCell.value, { outgoing: true });
    edges.forEach((edge) => {
      const targetNode = edge.getTargetCell() as Node;
      if (!targetNode) return;
      const targetBBox = targetNode.getBBox();
      maxY = Math.max(maxY, targetBBox.y);
    });

    // 如果是开始节点
    if (nodeData.config.type === 'start') {
      if (edges.length > 0) {
        alert('开始节点只能有一个子节点');
        showContextMenu.value = false;
        return;
      }

      nodeData.config.outputs = [{ id: 'out-0', name: '输出', type: value as AssetType }];
      selectedCell.value.setData(nodeData);

      const baseNode = nodeList.value.find((node) => node.type === 'asset' && node.inputs?.[0]?.type === value);
      const newNodeConfig = baseNode
        ? {
            ...baseNode,
            name: getAssetTypeName(value as AssetType), // 使用中文资产名称
          }
        : {
            id: `node-${Date.now()}`,
            name: getAssetTypeName(value as AssetType), // 使用中文资产名称
            scriptId: value as string,
            type: 'asset',
            shape: 'dynamic-node',
            inputs: [{ id: 'in-0', name: '输入', type: value as AssetType }],
            outputs: [{ id: 'out-0', name: '输出', type: value as AssetType }],
            style: {
              backgroundColor: '#fff',
              borderColor: '#1890ff',
              textColor: '#1890ff',
            },
          };

      const position = {
        x: startNodeBBox.x + horizontalGap,
        y: startNodeBBox.y,
      };

      const newNode = graph.addNode({
        ...position,
        width: 200,
        height: 40,
        shape: 'dynamic-node',
        data: { config: newNodeConfig },
        ports: {
          items: [
            {
              id: 'in-0',
              group: 'in',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#C2C8D5',
                  strokeWidth: 1,
                  fill: '#fff',
                },
              },
            },
            {
              id: 'out-0',
              group: 'out',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#C2C8D5',
                  strokeWidth: 1,
                  fill: '#fff',
                },
              },
            },
          ],
        },
      });

      if (newNode && selectedCell.value instanceof Node) {
        const edge = createEdge(selectedCell.value, newNode);
        if (edge && graph) {
          graph.addCell(edge);
        }
      }
    } else {
      // 如果不是开始节点
      const selectedOption = assetTypeOptions.value.find((option) => option.value === value) as AssetTypeOption;
      if (!selectedOption?.mockNode) {
        showContextMenu.value = false;
        return;
      }

      // 保持原有的 mockNode 名称，因为这是功能节点（如扫描节点）
      const mockNode = selectedOption.mockNode;
      const outputTypes = mockNode.outputs?.[0]?.type;

      if (!outputTypes) {
        showContextMenu.value = false;
        return;
      }

      // 首先创建选中的节点（功能节点）
      const mainNodePosition = {
        x: startNodeBBox.x + horizontalGap,
        y: edges.length === 0 ? startNodeBBox.y : maxY + verticalGap,
      };

      const mainNode = graph.addNode({
        ...mainNodePosition,
        width: 200,
        height: 40,
        shape: 'dynamic-node',
        data: { config: mockNode }, // 使用原始的 mockNode，保持其原有名称
        ports: {
          items: [
            {
              id: 'in-0',
              group: 'in',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#C2C8D5',
                  strokeWidth: 1,
                  fill: '#fff',
                },
              },
            },
            {
              id: 'out-0',
              group: 'out',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#C2C8D5',
                  strokeWidth: 1,
                  fill: '#fff',
                },
              },
            },
          ],
        },
      });

      // 连接选中的节点和源节点
      if (mainNode && selectedCell.value instanceof Node) {
        const edge = createEdge(selectedCell.value, mainNode);
        if (edge && graph) {
          graph.addCell(edge);
        }
      }

      // 创建输出节点（资产节点）
      const allOutputTypes = Array.isArray(outputTypes) ? outputTypes : [outputTypes];

      // 计算所有输出节点的垂直位置范围
      const totalHeight = (allOutputTypes.length - 1) * nodeSpacing;
      const startY = mainNodePosition.y - totalHeight / 2;

      allOutputTypes.forEach((type, index) => {
        const baseNode = nodeList.value.find((node) => node.type === 'asset' && node.inputs?.[0]?.type === type);

        // 对于资产节点，使用中文名称
        const outputNodeConfig = baseNode
          ? {
              ...baseNode,
              name: getAssetTypeName(type), // 资产节点使用中文名称
            }
          : {
              id: `node-${Date.now()}-${type}`,
              name: getAssetTypeName(type), // 资产节点使用中文名称
              scriptId: type,
              type: 'asset',
              shape: 'dynamic-node',
              inputs: [{ id: 'in-0', name: '输入', type }],
              outputs: [{ id: 'out-0', name: '输出', type }],
              style: {
                backgroundColor: '#fff',
                borderColor: '#1890ff',
                textColor: '#1890ff',
              },
            };

        // 修改输出节点的位置计算
        const outputNodePosition = {
          x: mainNodePosition.x + horizontalGap,
          y: startY + index * nodeSpacing, // 使用新的垂直位置计算
        };

        const outputNode = graph.addNode({
          ...outputNodePosition,
          width: 200,
          height: 40,
          shape: 'dynamic-node',
          data: { config: outputNodeConfig },
          ports: {
            items: [
              {
                id: 'in-0',
                group: 'in',
                attrs: {
                  circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#C2C8D5',
                    strokeWidth: 1,
                    fill: '#fff',
                  },
                },
              },
              {
                id: 'out-0',
                group: 'out',
                attrs: {
                  circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#C2C8D5',
                    strokeWidth: 1,
                    fill: '#fff',
                  },
                },
              },
            ],
          },
        });

        // 连接主节点和输出节点
        if (outputNode && mainNode instanceof Node) {
          const edge = createEdge(mainNode, outputNode);
          if (edge && graph) {
            graph.addCell(edge);
          }
        }
      });
    }

    showContextMenu.value = false;
  };
  const deleteSelected = () => {
    if (!graph || !selectedCell.value) return;

    // 如果是开始节点，不允许删除
    if (selectedCell.value instanceof Node) {
      const nodeData = selectedCell.value.getData();
      if (nodeData?.config?.type === 'start') {
        showContextMenu.value = false;
        return;
      }
    }

    // 获取要删除节点的所有连接边
    const connectedEdges = graph.getConnectedEdges(selectedCell.value);

    // 遍历所有连接的边，找到连接的资产节点
    const assetNodesToDelete: Node[] = [];
    connectedEdges.forEach((edge) => {
      const targetCell = edge.getTargetCell() as Node;
      if (targetCell && targetCell.getData()?.config?.type === 'asset') {
        // 检查资产节点的父节点是否是开始节点
        const parentEdges = graph.getConnectedEdges(targetCell, { incoming: true });
        const isParentStartNode = parentEdges.some((parentEdge) => {
          const parentCell = parentEdge.getSourceCell() as Node;
          return parentCell.getData()?.config?.type === 'start';
        });

        // 如果父节点不是开始节点，则添加到待删除列表
        if (!isParentStartNode) {
          assetNodesToDelete.push(targetCell);
        }
      }
    });

    // 删除选中的节点
    selectedCell.value.remove();

    // 删除连接的资产节点
    assetNodesToDelete.forEach((node) => {
      node.remove();
    });

    showContextMenu.value = false;
  };
  // 关闭右键菜单
  const _closeContextMenu = () => {
    showContextMenu.value = false;
    selectedCell.value = null;
  };

  // 添加保存功能
  const saveDag = async () => {
    if (!graph) return;

    const nodes = graph.getNodes();
    const edges = graph.getEdges();

    const dagData = {
      id: workflowId.value,
      nodes: nodes,
      edges: edges,
    };

    try {
      // 调用保存接口
      await saveWorkflow(dagData);
      alert('工作流保存成功');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请查看控制台错误信息');
    }
  };

  // 缩放相关
  const zoomLevel = ref(1); // 当前缩放级别
  const zoomStep = 0.1; // 每次缩放步长
  const minZoom = 0.5; // 最小缩放比例
  const maxZoom = 2; // 最大缩放比例

  // 放大
  const zoomIn = () => {
    if (!graph) return;
    const newZoom = Math.min(zoomLevel.value + zoomStep, maxZoom);
    graph.scale(newZoom);
    zoomLevel.value = newZoom;
  };

  // 缩小
  const zoomOut = () => {
    if (!graph) return;
    const newZoom = Math.max(zoomLevel.value - zoomStep, minZoom);
    graph.scale(newZoom);
    zoomLevel.value = newZoom;
  };

  // 重置缩放
  const resetZoom = () => {
    if (!graph) return;
    graph.scale(1);
    graph.centerContent(); // 居中显示内容
    zoomLevel.value = 1;
  };

  onMounted(() => {
    if (!container.value) return;

    // 创建画布
    graph = new Graph({
      container: container.value,
      grid: {
        visible: true,
        type: 'dot',
        size: 10,
        args: {
          color: '#E2E2E2',
        },
      },
      mousewheel: {
        enabled: true,
        modifiers: [], // 移除ctrl/meta修饰键限制，允许直接使用滚轮缩放
        factor: 1.1, // 缩放因子
        maxScale: maxZoom,
        minScale: minZoom,
        zoomAtMousePosition: true, // 在鼠标位置缩放
      },
      connecting: {
        router: {
          name: 'manhattan',
          args: {
            padding: 10,
            startDirections: ['right'],
            endDirections: ['left'],
          },
        },
        connector: {
          name: 'rounded',
          args: {
            radius: 8,
          },
        },
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        snap: true,
        createEdge() {
          return graph!.createEdge({
            attrs: {
              line: {
                stroke: '#A2B1C3',
                strokeWidth: 2,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
              },
            },
            router: {
              name: 'manhattan',
              args: {
                padding: 10,
                startDirections: ['right'],
                endDirections: ['left'],
              },
            },
            connector: {
              name: 'rounded',
              args: {
                radius: 8,
              },
            },
          });
        },
        validateConnection({ sourceView, targetView, sourceMagnet, targetMagnet, sourceCell, targetCell, sourcePort, targetPort }) {
          if (!sourceMagnet || !targetMagnet || !sourceView || !targetView || !graph) {
            return false;
          }

          // 只允许从输出端口连接到输入端口
          if (!sourcePort?.startsWith('out-') || !targetPort?.startsWith('in-')) {
            return false;
          }

          // 获取源节点和目标节点的配置
          const sourceData = sourceCell?.getData()?.config as NodeConfig;
          const targetData = targetCell?.getData()?.config as NodeConfig;
          if (!sourceData || !targetData) return false;

          // 如果是开始节点，检查是否已有连接
          if (sourceData.type === 'start') {
            const edges = graph!.getConnectedEdges(sourceCell!, { outgoing: true });
            if (edges.length > 0) {
              return false;
            }
          }

          // 获取端口索引
          const sourcePortIndex = parseInt(sourcePort.split('-')[1] || '0');
          const targetPortIndex = parseInt(targetPort.split('-')[1] || '0');

          // 获取端口类型
          const sourcePortType = sourceData.outputs?.[sourcePortIndex]?.type;
          const targetPortType = targetData.inputs?.[targetPortIndex]?.type;

          // 验证类型是否匹配
          if (!sourcePortType || !targetPortType) return false;

          // 修改类型比较逻辑
          if (Array.isArray(sourcePortType) && Array.isArray(targetPortType)) {
            return sourcePortType.some((sType) => targetPortType.includes(sType));
          } else if (Array.isArray(sourcePortType)) {
            return sourcePortType.some((type) => type === targetPortType);
          } else if (Array.isArray(targetPortType)) {
            return targetPortType.some((type) => type === sourcePortType);
          }

          return sourcePortType === targetPortType;
        },
        validateMagnet({ magnet }) {
          const portId = magnet?.getAttribute('port');
          // 输入端口不能作为连线的起点
          return portId?.startsWith('out-') || false;
        },
      },
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          args: {
            padding: 4,
            attrs: {
              strokeWidth: 4,
              stroke: '#52c41a',
            },
          },
        },
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            padding: 4,
            attrs: {
              strokeWidth: 4,
              stroke: '#ff4d4f',
            },
          },
        },
      },
      width: 1300,
      height: 600,
      panning: {
        enabled: true,
      },
      interacting: {
        nodeMovable: true,
        magnetConnectable: true,
      },
    });

    // 添加开始节点
    const startNode = {
      ...mockNodes[0],
      outputs: [
        { id: 'out-0', name: '输出', type: undefined }, // 初始时类型未定义
      ],
    };

    const _startNodeInstance = graph.addNode({
      x: 50, // 将开始节点位置向左移动
      y: 100,
      width: 200,
      height: 40,
      shape: 'dynamic-node',
      data: { config: startNode },
      ports: {
        items: [
          {
            id: 'out-0',
            group: 'out',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#C2C8D5',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          },
        ],
      },
    });

    // 修改节点的点击事件处理
    graph.on('node:click', ({ node, e }) => {
      e.stopPropagation();
      selectedCell.value = node;
      contextMenuPosition.value = {
        x: e.clientX,
        y: e.clientY,
      };
      showContextMenu.value = true;
    });

    // 恢复右键菜单事件
    graph.on('node:contextmenu', ({ node, e }) => {
      e.preventDefault();
      const nodeData = node.getData()?.config;

      // 如果是开始节点，不显示删除选项
      if (nodeData?.type === 'start') {
        return;
      }

      selectedCell.value = node;
      contextMenuPosition.value = {
        x: e.clientX,
        y: e.clientY,
      };
      showContextMenu.value = true;
    });

    graph.on('edge:contextmenu', ({ edge, e }) => {
      e.preventDefault();
      selectedCell.value = edge;
      contextMenuPosition.value = {
        x: e.clientX,
        y: e.clientY,
      };
      showContextMenu.value = true;
    });

    // 点击画布空白处关闭所有弹出层
    graph.on('blank:click', () => {
      showContextMenu.value = false;
      selectedCell.value = null;
    });

    // 添加键盘删除事件
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Delete' && selectedCell.value) {
        deleteSelected();
      }
    });

    // 监听缩放事件
    graph.on('scale', ({ sx }) => {
      zoomLevel.value = Math.round(sx * 100) / 100; // 保留两位小数
    });
  });

  // 组件卸载时移除事件监听
  onUnmounted(() => {
    document.removeEventListener('keydown', (e) => {
      if (e.key === 'Delete' && selectedCell.value) {
        deleteSelected();
      }
    });
  });
</script>

<style scoped>
  .dag-container {
    width: 100%;
    height: 600px;
    background-color: #f5f5f5;
    overflow: hidden;
    position: relative;
  }

  .x6-graph {
    width: 100%;
    height: 100%;
  }

  .context-menu {
    position: fixed;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    border: 1px solid #e8e8e8;
    min-width: 120px;
    padding: 4px 0;
  }

  .context-menu-item {
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.3s;
    color: #333;
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  .context-menu-item:hover {
    background: #f5f5f5;
    color: #1890ff;
  }

  .context-menu-divider {
    height: 1px;
    background-color: #e8e8e8;
    margin: 4px 0;
  }

  .save-button {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 8px 16px;
    background-color: #1890ff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s;
  }

  .save-button:hover {
    background-color: #40a9ff;
  }

  .zoom-controls {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 4px;
    user-select: none;
  }

  .zoom-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    font-size: 18px;
    background-color: #fafafa;
    border: 1px solid #f0f0f0;
    transition: all 0.3s;
    margin: 0 2px;
  }

  .zoom-btn:hover {
    background-color: #e6f7ff;
    border-color: #1890ff;
    color: #1890ff;
  }

  .zoom-btn:active {
    background-color: #bae7ff;
  }

  .zoom-text {
    margin: 0 8px;
    font-size: 14px;
    min-width: 50px;
    text-align: center;
    color: #666;
  }

  .zoom-reset {
    margin-left: 8px;
    width: auto;
    padding: 0 12px;
    font-size: 14px;
    font-weight: normal;
    color: #666;
    border-left: 1px solid #f0f0f0;
  }
</style>
