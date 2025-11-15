<template>
  <div class="demo-container">
    <h3>基础分页</h3>
    <a-space direction="vertical" :size="16" style="width: 100%">
      <!-- 基本使用 -->
      <a-card title="基本使用">
        <p>最简单的分页控制</p>

        <a-descriptions :column="2" bordered style="margin-bottom: 16px">
          <a-descriptions-item label="当前页">{{ current }}</a-descriptions-item>
          <a-descriptions-item label="每页条数">{{ pageSize }}</a-descriptions-item>
          <a-descriptions-item label="总条数">{{ total }}</a-descriptions-item>
          <a-descriptions-item label="总页数">{{ totalPage }}</a-descriptions-item>
        </a-descriptions>

        <a-space>
          <a-button :disabled="isFirstPage" @click="prev">上一页</a-button>
          <a-button :disabled="isLastPage" @click="next">下一页</a-button>
          <a-button @click="first">首页</a-button>
          <a-button @click="last">尾页</a-button>
          <a-button @click="reset">重置</a-button>
        </a-space>
      </a-card>

      <!-- 自定义页码大小 -->
      <a-card title="自定义页码大小">
        <p>改变每页显示的条数</p>

        <a-space style="margin-bottom: 16px">
          <span>每页条数：</span>
          <a-radio-group v-model:value="pageSize2" @change="handlePageSizeChange2">
            <a-radio-button :value="5">5 条/页</a-radio-button>
            <a-radio-button :value="10">10 条/页</a-radio-button>
            <a-radio-button :value="20">20 条/页</a-radio-button>
            <a-radio-button :value="50">50 条/页</a-radio-button>
          </a-radio-group>
        </a-space>

        <a-pagination
          v-model:current="current2"
          v-model:page-size="pageSize2"
          :total="total2"
          :show-total="(total) => `共 ${total} 条数据`"
        />
      </a-card>

      <!-- 快速跳转 -->
      <a-card title="快速跳转">
        <p>直接跳转到指定页码</p>

        <a-space style="margin-bottom: 16px">
          <span>跳转到：</span>
          <a-input-number v-model:value="jumpPage" :min="1" :max="totalPage3" style="width: 120px" />
          <a-button type="primary" @click="handleJump">跳转</a-button>
        </a-space>

        <a-pagination v-model:current="current3" :page-size="pageSize3" :total="total3" show-quick-jumper />
      </a-card>

      <!-- 分页状态显示 -->
      <a-card title="分页状态">
        <a-space direction="vertical" style="width: 100%">
          <a-alert
            :message="`当前是${isFirstPage4 ? '第一页' : isLastPage4 ? '最后一页' : '中间页'}`"
            :type="isFirstPage4 || isLastPage4 ? 'warning' : 'info'"
          />

          <a-progress :percent="(current4 / totalPage4) * 100" :show-info="false" />

          <div>
            页码范围: 第 {{ (current4 - 1) * pageSize4 + 1 }} - {{ Math.min(current4 * pageSize4, total4) }} 条， 共
            {{ total4 }} 条数据
          </div>

          <a-pagination v-model:current="current4" :page-size="pageSize4" :total="total4" />
        </a-space>
      </a-card>
    </a-space>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { usePagination } from 'zhongjiayao_v3_hooks';

  // 1. 基本使用
  const { current, pageSize, total, totalPage, isFirstPage, isLastPage, prev, next, first, last, reset, setTotal } =
    usePagination({
      defaultCurrent: 1,
      defaultPageSize: 10,
      total: 100,
    });

  // 2. 自定义页码大小
  const {
    current: current2,
    pageSize: pageSize2,
    total: total2,
    changePageSize: changePageSize2,
  } = usePagination({
    defaultPageSize: 10,
    total: 200,
  });

  const handlePageSizeChange2 = () => {
    changePageSize2(pageSize2.value);
  };

  // 3. 快速跳转
  const {
    current: current3,
    pageSize: pageSize3,
    total: total3,
    totalPage: totalPage3,
    changeCurrent: changeCurrent3,
  } = usePagination({
    defaultPageSize: 15,
    total: 150,
  });

  const jumpPage = ref(1);
  const handleJump = () => {
    changeCurrent3(jumpPage.value);
  };

  // 4. 分页状态
  const {
    current: current4,
    pageSize: pageSize4,
    total: total4,
    totalPage: totalPage4,
    isFirstPage: isFirstPage4,
    isLastPage: isLastPage4,
  } = usePagination({
    defaultPageSize: 20,
    total: 250,
  });
</script>

<style scoped>
  .demo-container {
    padding: 20px;
  }
</style>
