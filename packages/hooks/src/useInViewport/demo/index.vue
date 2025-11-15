<template>
  <div class="demo-container">
    <h3>useInViewport 演示</h3>
    <a-space direction="vertical" :size="16" style="width: 100%">
      <!-- 基础用法 -->
      <a-card title="基础用法">
        <p>向下滚动页面，观察元素进入视口的状态</p>
        <div class="scroll-container">
          <div class="spacer">向下滚动 ↓</div>

          <div ref="basicRef" class="target-box" :class="{ visible: basicInViewport }">
            <p>{{ basicInViewport ? '✅ 在视口内' : '❌ 不在视口内' }}</p>
            <p>可见比率: {{ (basicRatio * 100).toFixed(0) }}%</p>
          </div>

          <div class="spacer">继续滚动 ↓</div>
        </div>
      </a-card>

      <!-- 自定义阈值 -->
      <a-card title="自定义阈值 (50% 可见时触发)">
        <div class="scroll-container">
          <div class="spacer">向下滚动 ↓</div>

          <div ref="thresholdRef" class="target-box" :class="{ visible: thresholdInViewport }">
            <p>{{ thresholdInViewport ? '✅ 超过 50% 可见' : '⏸️  未达到 50%' }}</p>
            <p>可见比率: {{ (thresholdRatio * 100).toFixed(0) }}%</p>
          </div>

          <div class="spacer">继续滚动 ↓</div>
        </div>
      </a-card>

      <!-- 提前触发 -->
      <a-card title="提前触发 (提前 200px)">
        <p>元素距离视口还有 200px 时就会触发</p>
        <div class="scroll-container">
          <div class="spacer">向下滚动 ↓</div>

          <div ref="marginRef" class="target-box" :class="{ visible: marginInViewport }">
            <p>{{ marginInViewport ? '✅ 已提前触发' : '⏸️  等待触发' }}</p>
            <p>可见比率: {{ (marginRatio * 100).toFixed(0) }}%</p>
          </div>

          <div class="spacer">继续滚动 ↓</div>
        </div>
      </a-card>

      <!-- 图片懒加载 -->
      <a-card title="图片懒加载示例">
        <div class="scroll-container">
          <div class="spacer">向下滚动查看图片懒加载 ↓</div>

          <div ref="imageRef" class="image-box">
            <img v-if="imageInViewport" src="https://picsum.photos/400/300?random=1" alt="懒加载图片" class="lazy-image" />
            <div v-else class="image-placeholder">
              <a-spin />
              <p>图片加载中...</p>
            </div>
          </div>

          <div class="spacer">结束</div>
        </div>
      </a-card>

      <!-- 统计信息 -->
      <a-card title="进入视口统计">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="基础示例">
            {{ basicInViewport ? '在视口内' : '不在视口内' }}
          </a-descriptions-item>
          <a-descriptions-item label="阈值示例">
            {{ thresholdInViewport ? '在视口内' : '不在视口内' }}
          </a-descriptions-item>
          <a-descriptions-item label="提前触发">
            {{ marginInViewport ? '已触发' : '未触发' }}
          </a-descriptions-item>
          <a-descriptions-item label="图片加载">
            {{ imageInViewport ? '已加载' : '未加载' }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- 无限滚动列表 -->
      <a-card title="无限滚动列表">
        <p>滚动到底部自动加载更多数据</p>
        <div class="infinite-scroll-container">
          <a-list :data-source="listData" :loading="loading">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :title="item.title" :description="item.description">
                  <template #avatar>
                    <a-avatar :style="{ backgroundColor: item.color }">
                      {{ item.id }}
                    </a-avatar>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>

          <!-- 加载更多触发器 -->
          <div ref="loadMoreRef" class="load-more-trigger">
            <a-spin v-if="loading" />
            <p v-else-if="hasMore" style="color: #999">滚动加载更多...</p>
            <p v-else style="color: #999">已加载全部数据</p>
          </div>
        </div>
      </a-card>
    </a-space>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { useInViewport } from 'zhongjiayao_v3_hooks';

  // 1. 基础用法
  const basicRef = ref();
  const { inViewport: basicInViewport, ratio: basicRatio } = useInViewport(basicRef);

  // 2. 自定义阈值（50% 可见时触发）
  const thresholdRef = ref();
  const { inViewport: thresholdInViewport, ratio: thresholdRatio } = useInViewport(thresholdRef, {
    threshold: 0.5,
  });

  // 3. 提前触发（元素距离视口 200px 时触发）
  const marginRef = ref();
  const { inViewport: marginInViewport, ratio: marginRatio } = useInViewport(marginRef, {
    rootMargin: '200px',
  });

  // 4. 图片懒加载
  const imageRef = ref();
  const { inViewport: imageInViewport } = useInViewport(imageRef, {
    rootMargin: '100px', // 提前 100px 加载
    threshold: 0.1,
  });

  // 5. 无限滚动列表
  const loadMoreRef = ref();
  const loading = ref(false);
  const hasMore = ref(true);
  const listData = ref([]);
  const page = ref(1);
  const pageSize = 10;
  const maxPage = 5; // 模拟最大页数

  // 生成随机颜色
  const getRandomColor = () => {
    const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 初始化数据
  const initData = () => {
    const data = [];
    for (let i = 1; i <= pageSize; i++) {
      data.push({
        id: i,
        title: `列表项 ${i}`,
        description: `这是第 ${i} 条数据的描述信息`,
        color: getRandomColor(),
      });
    }
    listData.value = data;
  };

  // 加载更多数据
  const loadMore = async () => {
    if (loading.value || !hasMore.value) return;

    loading.value = true;

    // 模拟网络请求
    await new Promise((resolve) => setTimeout(resolve, 1000));

    page.value++;
    const start = (page.value - 1) * pageSize + 1;
    const newData = [];

    for (let i = 0; i < pageSize; i++) {
      const id = start + i;
      newData.push({
        id,
        title: `列表项 ${id}`,
        description: `这是第 ${id} 条数据的描述信息`,
        color: getRandomColor(),
      });
    }

    listData.value = [...listData.value, ...newData];
    loading.value = false;

    // 检查是否还有更多数据
    if (page.value >= maxPage) {
      hasMore.value = false;
    }
  };

  // 监听加载更多触发器进入视口
  const { inViewport: loadMoreInViewport } = useInViewport(loadMoreRef, {
    // rootMargin: '100px', // 提前 100px 触发
    threshold: 1,
  });

  watch(loadMoreInViewport, (isInView) => {
    if (isInView && hasMore.value && !loading.value) {
      loadMore();
    }
  });

  // 初始化
  initData();
</script>

<style scoped>
  .demo-container {
    padding: 20px;
  }

  .scroll-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
  }

  .spacer {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 16px;
  }

  .target-box {
    margin: 20px;
    padding: 40px;
    background: #f0f0f0;
    border: 2px solid #d9d9d9;
    border-radius: 8px;
    text-align: center;
    transition: all 0.3s ease;
  }

  .target-box.visible {
    background: #e6f7ff;
    border-color: #1890ff;
    transform: scale(1.05);
  }

  .target-box p {
    margin: 8px 0;
    font-size: 16px;
  }

  .image-box {
    margin: 20px;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
  }

  .lazy-image {
    max-width: 100%;
    border-radius: 4px;
    animation: fadeIn 0.5s ease-in;
  }

  .image-placeholder {
    text-align: center;
    color: #999;
  }

  .image-placeholder p {
    margin-top: 16px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .infinite-scroll-container {
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 16px;
  }

  .load-more-trigger {
    padding: 20px;
    text-align: center;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
