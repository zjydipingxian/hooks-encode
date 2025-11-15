<template>
  <div class="demo-container">
    <h3>表格分页</h3>
    <a-space direction="vertical" :size="16" style="width: 100%">
      <!-- 基础表格分页 -->
      <a-card title="基础表格分页">
        <a-table
          :columns="columns"
          :data-source="tableData"
          :pagination="{
            current: current,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }"
          :loading="loading"
          @change="handleTableChange"
        />
      </a-card>

      <!-- 带搜索的表格分页 -->
      <a-card title="带搜索的表格分页">
        <a-space style="margin-bottom: 16px">
          <a-input-search v-model:value="searchKeyword" placeholder="搜索用户名" style="width: 200px" @search="handleSearch" />
          <a-button @click="handleReset">重置</a-button>
        </a-space>

        <a-table
          :columns="columns"
          :data-source="searchTableData"
          :pagination="{
            current: searchCurrent,
            pageSize: searchPageSize,
            total: searchTotal,
            showSizeChanger: true,
            showTotal: (total) => `搜索到 ${total} 条结果`,
          }"
          :loading="searchLoading"
          @change="handleSearchTableChange"
        />
      </a-card>

      <!-- 服务端分页模拟 -->
      <a-card title="服务端分页">
        <p>模拟从服务器获取分页数据</p>

        <a-space style="margin-bottom: 16px">
          <a-button type="primary" :loading="serverLoading" @click="fetchServerData"> 刷新数据 </a-button>
          <span v-if="!serverLoading"> 第 {{ serverCurrent }} 页，共 {{ serverTotal }} 条数据 </span>
        </a-space>

        <a-table
          :columns="columns"
          :data-source="serverTableData"
          :pagination="{
            current: serverCurrent,
            pageSize: serverPageSize,
            total: serverTotal,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }"
          :loading="serverLoading"
          @change="handleServerTableChange"
        />
      </a-card>
    </a-space>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import { usePagination } from 'zhongjiayao_v3_hooks';

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 100,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  // 生成模拟数据
  const generateData = (page, pageSize, total) => {
    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, total);
    const data = [];

    for (let i = start; i < end; i++) {
      data.push({
        key: i,
        id: i + 1,
        name: `用户${i + 1}`,
        email: `user${i + 1}@example.com`,
        age: 20 + (i % 50),
        address: `地址 ${i + 1}`,
      });
    }

    return data;
  };

  // 1. 基础表格分页
  const { current, pageSize, total, changeCurrent, changePageSize } = usePagination({
    defaultPageSize: 10,
    total: 100,
  });

  const loading = ref(false);
  const tableData = computed(() => {
    return generateData(current.value, pageSize.value, total.value);
  });

  const handleTableChange = (pagination) => {
    changeCurrent(pagination.current);
    changePageSize(pagination.pageSize);
  };

  // 2. 带搜索的表格分页
  const searchKeyword = ref('');
  const {
    current: searchCurrent,
    pageSize: searchPageSize,
    total: searchTotal,
    changeCurrent: changeSearchCurrent,
    changePageSize: changeSearchPageSize,
    setTotal: setSearchTotal,
    reset: resetSearch,
  } = usePagination({
    defaultPageSize: 10,
    total: 100,
  });

  const searchLoading = ref(false);
  const allData = ref(generateData(1, 100, 100));

  const searchTableData = computed(() => {
    let filtered = allData.value;

    // 搜索过滤
    if (searchKeyword.value) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()));
    }

    // 更新总数
    setSearchTotal(filtered.length);

    // 分页
    const start = (searchCurrent.value - 1) * searchPageSize.value;
    const end = start + searchPageSize.value;
    return filtered.slice(start, end);
  });

  const handleSearch = () => {
    searchLoading.value = true;
    changeSearchCurrent(1); // 搜索时回到第一页
    setTimeout(() => {
      searchLoading.value = false;
    }, 300);
  };

  const handleReset = () => {
    searchKeyword.value = '';
    resetSearch();
  };

  const handleSearchTableChange = (pagination) => {
    changeSearchCurrent(pagination.current);
    changeSearchPageSize(pagination.pageSize);
  };

  // 3. 服务端分页
  const {
    current: serverCurrent,
    pageSize: serverPageSize,
    total: serverTotal,
    changeCurrent: changeServerCurrent,
    changePageSize: changeServerPageSize,
    setTotal: setServerTotal,
  } = usePagination({
    defaultPageSize: 10,
  });

  const serverLoading = ref(false);
  const serverTableData = ref([]);

  // 模拟服务端请求
  const fetchServerData = async () => {
    serverLoading.value = true;

    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 模拟服务端返回的数据
    const mockTotal = 156; // 模拟总数
    setServerTotal(mockTotal);

    serverTableData.value = generateData(serverCurrent.value, serverPageSize.value, mockTotal);

    serverLoading.value = false;
  };

  const handleServerTableChange = (pagination) => {
    changeServerCurrent(pagination.current);
    changeServerPageSize(pagination.pageSize);
    fetchServerData();
  };

  // 监听分页变化，自动加载数据
  watch(
    [serverCurrent, serverPageSize],
    () => {
      if (serverTableData.value.length === 0) {
        fetchServerData();
      }
    },
    { immediate: true },
  );
</script>

<style scoped>
  .demo-container {
    padding: 20px;
  }
</style>
