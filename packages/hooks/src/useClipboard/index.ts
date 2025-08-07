import { Ref, ref, unref } from 'vue';

export type clipboardOptions = {
  clipboardContent: Ref<string>;

  copyToClipboard: (text: string) => void;
  readFromClipboard: () => void;
};

function useClipboard(defaultValue: Ref<string> | string): clipboardOptions {
  const clipboardContent = ref(unref(defaultValue));

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      clipboardContent.value = text;
      console.log('内容已复制到剪贴板', text);
    } catch (err) {
      console.error('复制到剪贴板失败: ', err);
    }
  };

  const readFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      clipboardContent.value = text;
      console.log('从剪贴板读取的内容: ', text);
    } catch (err) {
      console.error('读取剪贴板内容失败: ', err);
    }
  };

  return {
    clipboardContent,
    copyToClipboard,
    readFromClipboard,
  };
}
export default useClipboard;
