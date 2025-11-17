<template>
  <div>
    <h3>WebSocket 连接状态: {{ readyState }}</h3>
    <a-space>
      <a-input v-model:value="message" placeholder="输入消息" />
      <a-button @click="handleSendMessage" :disabled="!connected">发送消息</a-button>
    </a-space>
    <a-space>
      <a-space>
        <!-- <a-button @click="handleConnect" v-if="!connected">连接</a-button> -->
        <a-button @click="handleDisconnect">断开</a-button>
      </a-space>
    </a-space>
    <div class="messages">
      <h4>消息记录:</h4>
      <div v-for="(msg, index) in messages" :key="index">
        {{ msg }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useWebSocket } from 'zhongjiayao_v3_hooks';

  const message = ref('');
  const messages = ref([]);
  const connected = ref(false);

  // 使用 useWebSocket hook
  const { webSocketIns, latestMessage, sendMessage, disconnect, connect, readyState } = useWebSocket('wss://ws.ifelse.io', {
    onOpen: (event) => {
      console.log('WebSocket 连接已建立', event);
      connected.value = true;
      messages.value.push('连接已建立');
    },
    onClose: (event) => {
      console.log('WebSocket 连接已关闭', event);
      messages.value.push('连接已关闭');
      connected.value = false;
    },
    onMessage: (event) => {
      console.log('收到消息:', event.data);
      messages.value.push(`收到: ${event.data}`);
    },
    onError: (error) => {
      console.error('WebSocket 错误:', error);
      messages.value.push(`错误: ${error.message || '未知错误'}`);
    },
    reconnectLimit: 2,
    reconnectInterval: 1000,
    heartbeatInterval: 3000,
  });

  // 发送消息
  const handleSendMessage = () => {
    if (message.value && connected.value) {
      console.log('发送消息:', message.value);
      sendMessage(message.value);
      messages.value.push(`发送: ${message.value}`);
      message.value = '';
    }
  };

  // 手动连接
  const handleConnect = () => {
    connect();
  };

  // 手动断开
  const handleDisconnect = () => {
    disconnect();
  };
</script>

<style>
  .messages {
    margin-top: 20px;
    border: 1px solid #eee;
    padding: 10px;
    max-height: 300px;
    overflow-y: auto;
  }
</style>
