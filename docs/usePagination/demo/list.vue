<template>
  <div class="demo-container">
    <h3>列表分页</h3>
    <a-space direction="vertical" :size="16" style="width: 100%">
      <!-- 卡片列表分页 -->
      <a-card title="卡片列表分页">
        <div class="card-list">
          <a-row :gutter="[16, 16]">
            <a-col v-for="item in cardListData" :key="item.id" :xs="24" :sm="12" :md="8" :lg="6">
              <a-card hoverable>
                <template #cover>
                  <div class="card-cover" :style="{ backgroundColor: item.color }">
                    <span style="font-size: 48px; color: white">{{ item.id }}</span>
                  </div>
                </template>
                <a-card-meta :title="item.title" :description="item.description" />
              </a-card>
            </a-col>
          </a-row>
        </div>

        <div style="margin-top: 16px; text-align: center">
          <a-pagination
            v-model:current="cardCurrent"
            v-model:page-size="cardPageSize"
            :total="cardTotal"
            :show-total="(total) => `共 ${total} 个项目`"
          />
        </div>
      </a-card>

      <!-- 文章列表分页 -->
      <a-card title="文章列表分页">
        <a-list
          :data-source="articleListData"
          :pagination="{
            current: articleCurrent,
            pageSize: articlePageSize,
            total: articleTotal,
            onChange: handleArticlePageChange,
            showTotal: (total) => `共 ${total} 篇文章`,
          }"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta :description="item.description">
                <template #title>
                  <a href="#">{{ item.title }}</a>
                </template>
                <template #avatar>
                  <a-avatar :src="item.avatar" />
                </template>
              </a-list-item-meta>
              <template #extra>
                <span style="color: #999">{{ item.date }}</span>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-card>

      <!-- 图片画廊分页 -->
      <a-card title="图片画廊分页">
        <div class="image-gallery">
          <a-row :gutter="[16, 16]">
            <a-col v-for="item in imageListData" :key="item.id" :xs="12" :sm="8" :md="6" :lg="4">
              <div class="image-item">
                <img :src="item.url" :alt="item.title" />
                <div class="image-title">{{ item.title }}</div>
              </div>
            </a-col>
          </a-row>
        </div>

        <div style="margin-top: 16px; text-align: center">
          <a-pagination
            v-model:current="imageCurrent"
            :page-size="imagePageSize"
            :total="imageTotal"
            :show-total="(total) => `共 ${total} 张图片`"
            simple
          />
        </div>
      </a-card>

      <!-- 迷你分页 -->
      <a-card title="迷你分页">
        <a-list :data-source="miniListData" size="small">
          <template #renderItem="{ item }">
            <a-list-item>
              <span>{{ item.title }}</span>
              <template #extra>
                <a-tag :color="item.status === 'active' ? 'green' : 'default'">
                  {{ item.status === 'active' ? '激活' : '禁用' }}
                </a-tag>
              </template>
            </a-list-item>
          </template>
        </a-list>

        <div style="margin-top: 16px; text-align: right">
          <a-pagination
            v-model:current="miniCurrent"
            :page-size="miniPageSize"
            :total="miniTotal"
            size="small"
            :show-total="(total) => `${total} 项`"
          />
        </div>
      </a-card>
    </a-space>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { usePagination } from 'zhongjiayao_v3_hooks';

  // 生成颜色
  const getRandomColor = () => {
    const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 1. 卡片列表分页
  const {
    current: cardCurrent,
    pageSize: cardPageSize,
    total: cardTotal,
  } = usePagination({
    defaultPageSize: 8,
    total: 48,
  });

  const cardListData = computed(() => {
    const start = (cardCurrent.value - 1) * cardPageSize.value;
    const end = start + cardPageSize.value;
    const data = [];

    for (let i = start; i < Math.min(end, cardTotal.value); i++) {
      data.push({
        id: i + 1,
        title: `项目 ${i + 1}`,
        description: `这是项目 ${i + 1} 的描述信息`,
        color: getRandomColor(),
      });
    }

    return data;
  });

  // 2. 文章列表分页
  const {
    current: articleCurrent,
    pageSize: articlePageSize,
    total: articleTotal,
    changeCurrent: changeArticleCurrent,
  } = usePagination({
    defaultPageSize: 5,
    total: 32,
  });

  const articleListData = computed(() => {
    const start = (articleCurrent.value - 1) * articlePageSize.value;
    const end = start + articlePageSize.value;
    const data = [];

    for (let i = start; i < Math.min(end, articleTotal.value); i++) {
      data.push({
        id: i + 1,
        title: `文章标题 ${i + 1}`,
        description: `这是文章 ${i + 1} 的摘要内容，描述了文章的主要内容和核心观点...`,
        avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
        date: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
      });
    }

    return data;
  });

  const handleArticlePageChange = (page) => {
    changeArticleCurrent(page);
  };

  // 3. 图片画廊分页
  const {
    current: imageCurrent,
    pageSize: imagePageSize,
    total: imageTotal,
  } = usePagination({
    defaultPageSize: 12,
    total: 60,
  });

  const imageListData = computed(() => {
    const start = (imageCurrent.value - 1) * imagePageSize.value;
    const end = start + imagePageSize.value;
    const data = [];

    for (let i = start; i < Math.min(end, imageTotal.value); i++) {
      data.push({
        id: i + 1,
        title: `图片 ${i + 1}`,
        url: `https://picsum.photos/200/150?random=${i + 1}`,
      });
    }

    return data;
  });

  // 4. 迷你分页
  const {
    current: miniCurrent,
    pageSize: miniPageSize,
    total: miniTotal,
  } = usePagination({
    defaultPageSize: 10,
    total: 50,
  });

  const miniListData = computed(() => {
    const start = (miniCurrent.value - 1) * miniPageSize.value;
    const end = start + miniPageSize.value;
    const data = [];

    for (let i = start; i < Math.min(end, miniTotal.value); i++) {
      data.push({
        id: i + 1,
        title: `列表项 ${i + 1}`,
        status: i % 3 === 0 ? 'active' : 'inactive',
      });
    }

    return data;
  });
</script>

<style scoped>
  .demo-container {
    padding: 20px;
  }

  .card-list {
    min-height: 400px;
  }

  .card-cover {
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-gallery {
    min-height: 300px;
  }

  .image-item {
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.3s;
  }

  .image-item:hover {
    transform: scale(1.05);
  }

  .image-item img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    display: block;
  }

  .image-title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 12px;
    text-align: center;
  }
</style>
