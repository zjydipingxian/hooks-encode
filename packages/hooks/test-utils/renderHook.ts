import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';

export default function renderHook(hook) {
  const result = ref();
  const TestComponent = defineComponent({
    setup() {
      result.value = hook();
      return {};
    },
    template: '<div></div>',
  });

  const wrapper = mount(TestComponent);
  return { result, wrapper };
}
