import { onMounted, onBeforeUnmount, nextTick } from 'vue';

function useWinResize(Action = () => {}) {
  const fn = () => {
    /**
     * 延迟更新重绘等操作
     */
    nextTick(() => {
      Action();
    });
  };

  // 检查是否在浏览器环境中
  if (typeof window !== 'undefined') {
    onMounted(() => {
      window.addEventListener('resize', fn, false);
    });
    onBeforeUnmount(() => {
      window.removeEventListener('resize', fn);
    });
  }
}

export default useWinResize;
