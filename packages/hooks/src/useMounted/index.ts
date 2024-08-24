import { getCurrentInstance, onMounted, ref } from 'vue';

function useMounted() {
  const isMounted = ref(false);
  const instance = getCurrentInstance();
  if (instance) {
    onMounted(() => {
      isMounted.value = true;
    });
  }

  return isMounted;
}

export default useMounted;
