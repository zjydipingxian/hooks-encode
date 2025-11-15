<template>
  <div class="demo-container">
    <h3>基础用法</h3>
    <a-space direction="vertical" :size="16" style="width: 100%">
      <!-- 单键监听 -->
      <a-card title="单键监听">
        <p>按下 <a-tag color="blue">Enter</a-tag> 键</p>
        <a-alert :message="enterPressed ? '✅ Enter 键已按下' : '⏸️  等待按键...'" :type="enterPressed ? 'success' : 'info'" />
      </a-card>

      <!-- 组合键监听 -->
      <a-card title="组合键监听">
        <p>按下 <a-tag color="blue">Ctrl + S</a-tag> 保存</p>
        <a-alert :message="saveStatus" :type="saveStatus.includes('保存成功') ? 'success' : 'info'" />
      </a-card>

      <!-- 多键监听 -->
      <a-card title="多键监听（方向键）">
        <p>按下方向键移动</p>
        <div class="arrow-container">
          <div class="arrow-row">
            <div class="arrow-key" :class="{ active: upPressed }">↑</div>
          </div>
          <div class="arrow-row">
            <div class="arrow-key" :class="{ active: leftPressed }">←</div>
            <div class="arrow-key" :class="{ active: downPressed }">↓</div>
            <div class="arrow-key" :class="{ active: rightPressed }">→</div>
          </div>
        </div>
        <p style="margin-top: 16px">当前位置: ({{ position.x }}, {{ position.y }})</p>
      </a-card>

      <!-- 自定义过滤器 -->
      <a-card title="自定义过滤器（仅数字键）">
        <p>只能输入数字</p>
        <a-input v-model:value="numberInput" placeholder="按数字键输入" :disabled="false" />
        <p style="margin-top: 8px; color: #999">最后按下的数字: {{ lastNumber }}</p>
      </a-card>

      <!-- Esc 键清空 -->
      <a-card title="Esc 键操作">
        <a-input v-model:value="textInput" placeholder="输入文本，按 Esc 清空" />
        <a-alert v-if="escPressed" message="按下 Esc 已清空输入" type="warning" style="margin-top: 8px" />
      </a-card>

      <!-- 指定目标元素 -->
      <a-card title="指定目标元素">
        <p>只在下方输入框中监听 Enter 键（全局不监听）</p>
        <a-input ref="targetInputRef" v-model:value="targetInput" placeholder="在此输入框按 Enter 提交" />
        <p style="margin-top: 8px; color: #52c41a" v-if="submitMessage">
          {{ submitMessage }}
        </p>
        <p style="margin-top: 8px; color: #999">提示：只有焦点在输入框内按 Enter 才会触发，其他地方按 Enter 不会触发</p>
      </a-card>
    </a-space>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useKeyPress } from 'zhongjiayao_v3_hooks';

  // 1. 单键监听
  const enterPressed = useKeyPress('Enter');

  // 2. 组合键监听
  const saveStatus = ref('⏸️  等待保存快捷键...');
  useKeyPress(['ctrl', 's'], (event) => {
    event.preventDefault(); // 阻止浏览器默认保存行为
    saveStatus.value = '✅ 保存成功！(Ctrl+S)';
    setTimeout(() => {
      saveStatus.value = '⏸️  等待保存快捷键...';
    }, 2000);
  });

  // 3. 方向键监听
  const upPressed = useKeyPress('ArrowUp');
  const downPressed = useKeyPress('ArrowDown');
  const leftPressed = useKeyPress('ArrowLeft');
  const rightPressed = useKeyPress('ArrowRight');

  const position = ref({ x: 0, y: 0 });
  const step = 10;

  useKeyPress('ArrowUp', () => {
    position.value.y -= step;
  });
  useKeyPress('ArrowDown', () => {
    position.value.y += step;
  });
  useKeyPress('ArrowLeft', () => {
    position.value.x -= step;
  });
  useKeyPress('ArrowRight', () => {
    position.value.x += step;
  });

  // 4. 自定义过滤器（仅数字键）
  const numberInput = ref('');
  const lastNumber = ref('');
  useKeyPress(
    (event) => {
      return /^[0-9]$/.test(event.key);
    },
    (event) => {
      lastNumber.value = event.key;
      numberInput.value += event.key;
    },
  );

  // 5. Esc 键清空
  const textInput = ref('');
  const escPressed = ref(false);
  useKeyPress('Escape', () => {
    textInput.value = '';
    escPressed.value = true;
    setTimeout(() => {
      escPressed.value = false;
    }, 1000);
  });

  // 6. 指定目标元素
  const targetInputRef = ref();
  const targetInput = ref('');
  const submitMessage = ref('');

  useKeyPress(
    'Enter',
    () => {
      if (targetInput.value.trim()) {
        submitMessage.value = `✅ 已提交: ${targetInput.value}`;
        targetInput.value = '';
        setTimeout(() => {
          submitMessage.value = '';
        }, 2000);
      }
    },
    {
      target: targetInputRef, // 只监听这个输入框
    },
  );
</script>

<style scoped>
  .demo-container {
    padding: 20px;
  }

  .arrow-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;
  }

  .arrow-row {
    display: flex;
    gap: 8px;
  }

  .arrow-key {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background: white;
    border: 2px solid #d9d9d9;
    border-radius: 8px;
    transition: all 0.2s;
    cursor: default;
    user-select: none;
  }

  .arrow-key.active {
    background: #1890ff;
    color: white;
    border-color: #1890ff;
    transform: scale(1.1);
  }
</style>
