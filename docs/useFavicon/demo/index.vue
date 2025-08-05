<template>
  <div style="padding: 16px">
    <span>{{ url }}</span>
    <div style="margin-top: 16px">
      <a-button class="button1" @click="changeUrl('https://www.google.com/favicon.ico')"> Change To Google favicon。 </a-button>
      <a-button
        class="button2"
        style="margin-left: 8px"
        @click="
          changeUrl('https://raw.githubusercontent.com/InhiblabCore/vue-hooks-plus/master/packages/hooks/docs/public/logo.svg')
        "
      >
        Change To VueHooks Plus favicon。
      </a-button>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useFavicon } from 'zhongjiayao_v3_hooks';
  const url = ref('https://raw.githubusercontent.com/InhiblabCore/vue-hooks-plus/master/packages/hooks/docs/public/logo.svg');

  const changeUrl = (_url) => {
    url.value = _url;
  };
  useFavicon(url);
</script>
